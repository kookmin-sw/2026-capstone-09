package kr.flowmeet.domain.file.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;

public interface FileInformationRepository extends JpaRepository<FileInformation, Long> {

    Optional<FileInformation> findByFileKey(String fileKey);

    Optional<FileInformation> findByDomainTypeAndEntityId(FileDomainType domainType, Long entityId);

    @Query("SELECT f.fileKey FROM FileInformation f " +
            "WHERE f.domainType = :domainType AND f.entityId = :entityId")
    List<String> findFileKeysByDomainTypeAndEntityId(@Param("domainType") FileDomainType domainType,
                                                     @Param("entityId") Long entityId);

    @Query("SELECT f.fileKey FROM FileInformation f " +
            "WHERE f.domainType = :domainType AND f.entityId IN :entityIds")
    List<String> findFileKeysByDomainTypeAndEntityIdIn(@Param("domainType") FileDomainType domainType,
                                                       @Param("entityIds") List<Long> entityIds);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM FileInformation f " +
            "WHERE f.domainType = :domainType AND f.entityId = :entityId")
    int deleteAllByDomainTypeAndEntityId(@Param("domainType") FileDomainType domainType,
                                         @Param("entityId") Long entityId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM FileInformation f " +
            "WHERE f.domainType = :domainType AND f.entityId IN :entityIds")
    int deleteAllByDomainTypeAndEntityIdIn(@Param("domainType") FileDomainType domainType,
                                           @Param("entityIds") List<Long> entityIds);
}
