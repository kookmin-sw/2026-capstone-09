package kr.flowmeet.domain.file.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import kr.flowmeet.domain.common.BaseCreatedTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file_information")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileInformation extends BaseCreatedTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 20)
    private String extension;

    @Column(nullable = false)
    private long size;

    @Enumerated(EnumType.STRING)
    @Column(name = "domain_type", nullable = false)
    private FileDomainType domainType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(length = 50)
    private String category;

    @Column(name = "upload_url", nullable = false, columnDefinition = "TEXT")
    private String uploadUrl;

    @Builder
    public FileInformation(String name, String extension, long size, FileDomainType domainType,
                           Long entityId, String category, String uploadUrl) {
        this.name = name;
        this.extension = extension;
        this.size = size;
        this.domainType = domainType;
        this.entityId = entityId;
        this.category = category;
        this.uploadUrl = uploadUrl;
    }
}
