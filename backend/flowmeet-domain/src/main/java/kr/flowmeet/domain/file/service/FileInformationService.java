package kr.flowmeet.domain.file.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;
import kr.flowmeet.domain.file.exception.FileErrorCode;
import kr.flowmeet.domain.file.repository.FileInformationRepository;
import kr.flowmeet.domain.file.service.vo.CreateFileInformationCommand;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileInformationService {

    private final FileInformationRepository fileInformationRepository;

    public FileInformation findByFileKey(final String fileKey) {
        return fileInformationRepository.findByFileKey(fileKey)
                .orElseThrow(() -> new BusinessException(FileErrorCode.FILE_NOT_FOUND));
    }

    @Transactional
    public FileInformation create(final String uploadUrl, final CreateFileInformationCommand command) {
        return fileInformationRepository.save(
                FileInformation.builder()
                        .fileKey(command.fileKey())
                        .name(command.name())
                        .extension(command.extension())
                        .size(command.size())
                        .contentType(command.contentType())
                        .domainType(FileDomainType.TEMP)
                        .uploadUrl(uploadUrl)
                        .build()
        );
    }

    @Transactional
    public void attach(final String fileKey, final FileDomainType domainType, final Long entityId) {
        FileInformation fileInformation = findByFileKey(fileKey);
        fileInformation.updateDomain(domainType, entityId);
    }

    public Optional<FileInformation> findByDomainTypeAndEntityId(final FileDomainType domainType, final Long entityId) {
        return fileInformationRepository.findByDomainTypeAndEntityId(domainType, entityId);
    }

    @Transactional
    public void delete(final FileInformation fileInformation) {
        fileInformationRepository.delete(fileInformation);
    }

    public List<String> findAllFileKeysByProjectScope(final Long projectId,
                                                      final List<Long> nodeIds,
                                                      final List<Long> meetingIds) {
        List<String> fileKeys = new java.util.ArrayList<>(
                fileInformationRepository.findFileKeysByDomainTypeAndEntityId(FileDomainType.PROJECT_IMAGE, projectId));

        if (!nodeIds.isEmpty()) {
            fileKeys.addAll(fileInformationRepository
                    .findFileKeysByDomainTypeAndEntityIdIn(FileDomainType.NODE_ATTACHMENT, nodeIds));
            fileKeys.addAll(fileInformationRepository
                    .findFileKeysByDomainTypeAndEntityIdIn(FileDomainType.NODE_NOTE_IMAGE, nodeIds));
        }
        if (!meetingIds.isEmpty()) {
            fileKeys.addAll(fileInformationRepository
                    .findFileKeysByDomainTypeAndEntityIdIn(FileDomainType.MEETING_SUMMARY, meetingIds));
        }
        return fileKeys;
    }

    @Transactional
    public void deleteAllByProjectScope(final Long projectId,
                                        final List<Long> nodeIds,
                                        final List<Long> meetingIds) {
        fileInformationRepository.deleteAllByDomainTypeAndEntityId(FileDomainType.PROJECT_IMAGE, projectId);

        if (!nodeIds.isEmpty()) {
            fileInformationRepository.deleteAllByDomainTypeAndEntityIdIn(FileDomainType.NODE_ATTACHMENT, nodeIds);
            fileInformationRepository.deleteAllByDomainTypeAndEntityIdIn(FileDomainType.NODE_NOTE_IMAGE, nodeIds);
        }
        if (!meetingIds.isEmpty()) {
            fileInformationRepository.deleteAllByDomainTypeAndEntityIdIn(FileDomainType.MEETING_SUMMARY, meetingIds);
        }
    }
}
