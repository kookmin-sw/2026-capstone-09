package kr.flowmeet.api.file.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Presigned URL 발급 응답")
public record CreatePresignedUrlResponse(
        @Schema(description = "파일 식별용 키", example = "node/20260419/abc123-meeting-notes.pdf")
        String fileKey,
        @Schema(description = "업로드에 사용할 Presigned URL", example = "https://flowmeet-bucket.s3.amazonaws.com/node/20260419/abc123-meeting-notes.pdf?X-Amz-Signature=...")
        String presignedUrl,
        @Schema(description = "업로드 완료 후 접근 가능한 최종 URL", example = "https://cdn.flowmeet.kr/node/20260419/abc123-meeting-notes.pdf")
        String uploadUrl
) {
}
