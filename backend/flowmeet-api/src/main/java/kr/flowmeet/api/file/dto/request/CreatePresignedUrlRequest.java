package kr.flowmeet.api.file.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Schema(description = "S3 업로드용 Presigned URL 발급 요청")
public record CreatePresignedUrlRequest(
        @Schema(description = "원본 파일 이름", example = "meeting-notes.pdf")
        @NotBlank(message = "파일 이름은 필수로 입력해 주세요.")
        String fileName,
        @Schema(description = "파일 크기(바이트)", example = "204800")
        @Positive(message = "파일 크기는 0보다 커야 해요.")
        long fileSize,
        @Schema(description = "콘텐츠 타입(MIME)", example = "application/pdf")
        @NotBlank(message = "콘텐츠 타입은 필수로 입력해 주세요.")
        String contentType
) {
}
