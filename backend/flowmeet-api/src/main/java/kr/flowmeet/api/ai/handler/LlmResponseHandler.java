package kr.flowmeet.api.ai.handler;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.flowmeet.api.node.event.NodeSummaryRequestEvent;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.entity.AiTaskType;
import kr.flowmeet.domain.ai.service.AiTaskService;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.external.sqs.dto.LlmResponseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LlmResponseHandler {

    private final AiTaskService aiTaskService;
    private final MeetingService meetingService;
    private final NodeService nodeService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public AiTask completeAndSave(final LlmResponseMessage response) {
        AiTask task = aiTaskService.complete(response.jobId());

        if (response.result() == null) {
            log.warn("LLM 응답에 result가 없음 - jobId: {}", response.jobId());
            return task;
        }

        if (response.isSubSummary()) {
            String summary = response.result().get("summary").asText();
            String mermaidCode = response.result().get("mermaid_code").asText();
            meetingService.saveSummary(task.getReferenceId(), summary, mermaidCode);
            try {
                tryTriggerMainSummary(task);
            } catch (Exception e) {
                log.error("main-summary 자동 트리거 실패 - jobId: {}", task.getId(), e);
            }
        } else if (response.isMainSummary()) {
            String summary = response.result().asText();
            nodeService.saveSummary(task.getReferenceId(), summary);
        }

        return task;
    }

    private void tryTriggerMainSummary(final AiTask task) {
        Meeting meeting = meetingService.findById(task.getReferenceId());
        Node node = nodeService.findById(meeting.getNodeId());

        if (node.getParentId() == null) {
            return;
        }

        List<Node> childNodes = nodeService.findAllByParentId(node.getParentId());
        List<Long> childNodeIds = childNodes.stream().map(Node::getId).toList();
        List<Meeting> meetings = meetingService.findAllByNodeIds(childNodeIds);

        Map<Long, Meeting> meetingByNodeId = meetings.stream()
                .collect(Collectors.toMap(Meeting::getNodeId, m -> m, (a, b) -> a));

        String mergedText = NodeSummaryTextMerger.merge(childNodes, meetingByNodeId);
        if (mergedText.isEmpty()) {
            return;
        }

        AiTask mainTask = aiTaskService.create(task.getUserId(), node.getProjectId(), node.getParentId(), AiTaskType.MAIN_SUMMARY);
        eventPublisher.publishEvent(new NodeSummaryRequestEvent(mainTask.getId(), mergedText));
        log.info("sub-summary 완료 → main-summary 자동 트리거 - parentNodeId: {}, jobId: {}",
                node.getParentId(), mainTask.getId());
    }
}