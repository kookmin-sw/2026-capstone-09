package kr.flowmeet.api.file.dto.response;

public record CreatePresignedUrlResponse(
        String fileKey,
        String presignedUrl,
        String uploadUrl
) {
}
