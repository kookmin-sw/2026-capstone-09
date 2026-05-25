package kr.flowmeet.mcpserver.tool;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class MeetingTools {

    private final RestClient backendRestClient;

    @Tool(name = "create_meeting", description = "특정 노드에 회의를 생성하고 화상 회의 링크를 발급합니다.")
    public String createMeeting(Long projectId, Long nodeId, String startedAt, List<Long> participantUserIds, boolean isPushEnabled) {
        return backendRestClient.post()
                .uri("/v1/projects/{projectId}/nodes/{nodeId}/meetings", projectId, nodeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "startedAt", startedAt,
                        "participantUserIds", participantUserIds,
                        "isPushEnabled", isPushEnabled
                ))
                .retrieve()
                .body(String.class);
    }

}