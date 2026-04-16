package kr.flowmeet.api.project.facade;

import java.util.List;
import kr.flowmeet.domain.file.service.FileInformationService;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectService;
import kr.flowmeet.domain.project.service.ProjectUrlService;
import kr.flowmeet.external.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
public class ProjectEraser {

    private final ProjectService projectService;
    private final ProjectMemberService projectMemberService;
    private final ProjectUrlService projectUrlService;
    private final NodeService nodeService;
    private final MeetingService meetingService;
    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;
    private final FileInformationService fileInformationService;
    private final FileStorageService fileStorageService;

    @Transactional
    public void erase(final Project project) {
        Long projectId = project.getId();
        List<Long> nodeIds = nodeService.findAllIdsByProjectId(projectId);
        List<Long> meetingIds = meetingService.findAllIdsByNodeIds(nodeIds);
        List<String> fileKeys = fileInformationService
                .findAllFileKeysByProjectScope(projectId, nodeIds, meetingIds);

        notificationService.deleteAllByProjectId(projectId);
        notificationSettingService.deleteAllByProjectId(projectId);
        meetingService.deleteAllByIds(meetingIds);
        nodeService.deleteAllByProjectId(projectId);
        projectMemberService.deleteAllByProjectId(projectId);
        projectUrlService.deleteAllByProjectId(projectId);
        fileInformationService.deleteAllByProjectScope(projectId, nodeIds, meetingIds);
        projectService.delete(project);

        registerS3CleanupAfterCommit(fileKeys);
    }

    private void registerS3CleanupAfterCommit(final List<String> fileKeys) {
        if (fileKeys.isEmpty()) {
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                fileKeys.forEach(fileStorageService::deleteObject);
            }
        });
    }
}
