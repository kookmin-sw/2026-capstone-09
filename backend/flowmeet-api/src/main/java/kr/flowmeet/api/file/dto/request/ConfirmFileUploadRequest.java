package kr.flowmeet.api.file.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.file.service.vo.CreateFileInformationCommand;

@Schema(description = "파일 업로드 완료 확인 요청")
public record ConfirmFileUploadRequest(
        @Schema(description = "Presigned URL 발급 시 받은 파일 키", example = "node/20260419/abc123-meeting-notes.pdf")
        @NotBlank(message = ValidationMessage.FILE_KEY_REQUIRED)
        String fileKey,
        @Schema(description = "원본 파일 이름", example = "meeting-notes.pdf")
        @NotBlank(message = ValidationMessage.FILE_NAME_REQUIRED)
        String fileName,
        @Schema(description = "파일 크기(바이트)", example = "204800")
        @Positive(message = ValidationMessage.FILE_SIZE_POSITIVE)
        long fileSize,
        @Schema(description = "파일 확장자", example = "pdf")
        @NotBlank(message = ValidationMessage.FILE_EXTENSION_REQUIRED)
        String extension,
        @Schema(description = "콘텐츠 타입(MIME)", example = "application/pdf")
        @NotBlank(message = ValidationMessage.FILE_CONTENT_TYPE_REQUIRED)
        String contentType
) {

    public CreateFileInformationCommand toCommand() {
        return CreateFileInformationCommand.of(fileKey, fileName, extension, fileSize, contentType);
    }
}
