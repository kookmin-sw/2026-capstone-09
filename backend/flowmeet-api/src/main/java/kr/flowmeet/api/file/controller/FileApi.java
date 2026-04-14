package kr.flowmeet.api.file.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.file.dto.request.ConfirmFileUploadRequest;
import kr.flowmeet.api.file.dto.request.CreatePresignedUrlRequest;
import kr.flowmeet.api.file.dto.response.CreatePresignedUrlResponse;
import kr.flowmeet.api.file.dto.response.FileInformationResponse;
import kr.flowmeet.domain.file.exception.FileErrorCode;

@Tag(name = "File")
public interface FileApi {

    @Operation(summary = "Presigned URL 발급", description = "S3 직접 업로드를 위한 Presigned URL을 발급합니다.")
    @ApiErrorCode(code = FileErrorCode.class, names = {"FILE_SIZE_EXCEEDED"})
    CommonResponse<CreatePresignedUrlResponse> createPresignedUrl(@Valid @RequestBody CreatePresignedUrlRequest request);

    @Operation(summary = "업로드 완료 등록", description = "클라이언트의 S3 업로드 완료 후 파일 정보를 등록합니다.")
    @ApiErrorCode(code = FileErrorCode.class, names = {"FILE_UPLOAD_NOT_COMPLETED"})
    CommonResponse<FileInformationResponse> confirmUpload(@Valid @RequestBody ConfirmFileUploadRequest request);

    @Operation(summary = "파일 삭제")
    @ApiErrorCode(code = FileErrorCode.class, names = {"FILE_NOT_FOUND"})
    CommonResponse<?> deleteFile(@RequestParam String fileKey);
}
