package kr.flowmeet.api.file.dto.response;

import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;

public record FileInformationResponse(
        String fileKey,
        String name,
        String extension,
        long size,
        FileDomainType domainType,
        Long entityId,
        String uploadUrl
) {
    public static FileInformationResponse from(final FileInformation fileInformation) {
        return new FileInformationResponse(
                fileInformation.getFileKey(),
                fileInformation.getName(),
                fileInformation.getExtension(),
                fileInformation.getSize(),
                fileInformation.getDomainType(),
                fileInformation.getEntityId(),
                fileInformation.getUploadUrl()
        );
    }
}
