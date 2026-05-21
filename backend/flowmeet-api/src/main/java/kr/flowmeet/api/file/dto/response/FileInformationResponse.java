package kr.flowmeet.api.file.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;

@Schema(description = "파일 정보 응답")
public record FileInformationResponse(
        @Schema(description = "파일 식별용 키", example = "node/20260419/abc123-meeting-notes.pdf")
        String fileKey,
        @Schema(description = "원본 파일 이름", example = "meeting-notes.pdf")
        String name,
        @Schema(description = "파일 확장자", example = "pdf")
        String extension,
        @Schema(description = "파일 크기(바이트)", example = "204800")
        long size,
        @Schema(description = "파일이 속한 도메인 타입", example = "NODE_ATTACHMENT")
        FileDomainType domainType,
        @Schema(description = "파일이 속한 엔티티 ID", example = "128")
        Long entityId,
        @Schema(description = "접근 가능한 최종 URL", example = "https://cdn.flowmeet.kr/node/20260419/abc123-meeting-notes.pdf")
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
