package kr.flowmeet.domain.file.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import kr.flowmeet.domain.common.BaseCreatedTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "file_information",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_file_information_file_key", columnNames = "file_key")
        },
        indexes = {
                @Index(name = "idx_file_information_domain_entity", columnList = "domain_type, entity_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileInformation extends BaseCreatedTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @Column(name = "file_key", nullable = false)
    private String fileKey;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 20)
    private String extension;

    @Column(nullable = false)
    private long size;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "domain_type", nullable = false)
    private FileDomainType domainType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "upload_url", nullable = false, columnDefinition = "TEXT")
    private String uploadUrl;

    @Builder
    public FileInformation(String fileKey, String name, String extension, long size,
                           String contentType, FileDomainType domainType, Long entityId,
                           String uploadUrl) {
        this.fileKey = fileKey;
        this.name = name;
        this.extension = extension;
        this.size = size;
        this.contentType = contentType;
        this.domainType = domainType;
        this.entityId = entityId;
        this.uploadUrl = uploadUrl;
    }

    public void updateDomain(final FileDomainType domainType, final Long entityId) {
        this.domainType = domainType;
        this.entityId = entityId;
    }
}
