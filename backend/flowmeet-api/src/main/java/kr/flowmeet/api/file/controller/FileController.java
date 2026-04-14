package kr.flowmeet.api.file.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.file.dto.request.ConfirmFileUploadRequest;
import kr.flowmeet.api.file.dto.request.CreatePresignedUrlRequest;
import kr.flowmeet.api.file.dto.response.CreatePresignedUrlResponse;
import kr.flowmeet.api.file.dto.response.FileInformationResponse;
import kr.flowmeet.api.file.facade.FileFacade;

@RestController
@RequestMapping("/v1/files")
@RequiredArgsConstructor
public class FileController implements FileApi {

    private final FileFacade fileFacade;

    @Override
    @PostMapping("/presigned-url")
    public CommonResponse<CreatePresignedUrlResponse> createPresignedUrl(
            @Valid @RequestBody final CreatePresignedUrlRequest request) {
        return CommonResponse.ok(fileFacade.createPresignedUrl(request));
    }

    @Override
    @PostMapping
    public CommonResponse<FileInformationResponse> confirmUpload(
            @Valid @RequestBody final ConfirmFileUploadRequest request) {
        return CommonResponse.ok(fileFacade.confirmUpload(request));
    }

    @Override
    @DeleteMapping
    public CommonResponse<?> deleteFile(@RequestParam final String fileKey) {
        fileFacade.deleteFile(fileKey);
        return CommonResponse.ok();
    }
}
