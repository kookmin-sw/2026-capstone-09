package kr.flowmeet.api.file.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "S3 업로드용 Presigned URL 발급 요청")
public record CreatePresignedUrlRequest(
        @Schema(description = "원본 파일 이름", example = "meeting-notes.pdf")
        @NotBlank(message = ValidationMessage.FILE_NAME_REQUIRED)
        String fileName,
        @Schema(description = "파일 크기(바이트)", example = "204800")
        @Positive(message = ValidationMessage.FILE_SIZE_POSITIVE)
        long fileSize,
        @Schema(description = "콘텐츠 타입(MIME)", example = "application/pdf")
        @NotBlank(message = ValidationMessage.FILE_CONTENT_TYPE_REQUIRED)
        String contentType
) {
}
