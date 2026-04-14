package kr.flowmeet.api.file.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ConfirmFileUploadRequest(
        @NotBlank(message = "파일 키는 필수로 입력해 주세요.")
        String fileKey,
        @NotBlank(message = "파일 이름은 필수로 입력해 주세요.")
        String fileName,
        @Positive(message = "파일 크기는 0보다 커야 해요.")
        long fileSize,
        @NotBlank(message = "확장자는 필수로 입력해 주세요.")
        String extension,
        @NotBlank(message = "콘텐츠 타입은 필수로 입력해 주세요.")
        String contentType
) {
}
