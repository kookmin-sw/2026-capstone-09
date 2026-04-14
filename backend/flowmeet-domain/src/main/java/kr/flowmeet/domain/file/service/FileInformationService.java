package kr.flowmeet.domain.file.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;
import kr.flowmeet.domain.file.exception.FileErrorCode;
import kr.flowmeet.domain.file.repository.FileInformationRepository;

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
    public FileInformation create(final FileInformation fileInformation) {
        return fileInformationRepository.save(fileInformation);
    }

    public Optional<FileInformation> findByDomainTypeAndEntityId(final FileDomainType domainType, final Long entityId) {
        return fileInformationRepository.findByDomainTypeAndEntityId(domainType, entityId);
    }

    @Transactional
    public void delete(final FileInformation fileInformation) {
        fileInformationRepository.delete(fileInformation);
    }
}
