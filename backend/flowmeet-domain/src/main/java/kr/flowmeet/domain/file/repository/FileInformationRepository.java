package kr.flowmeet.domain.file.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;

public interface FileInformationRepository extends JpaRepository<FileInformation, Long> {

    Optional<FileInformation> findByFileKey(String fileKey);

    Optional<FileInformation> findByDomainTypeAndEntityId(FileDomainType domainType, Long entityId);
}
