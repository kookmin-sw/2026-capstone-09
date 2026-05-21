package kr.flowmeet.api.file.facade;

import java.net.URL;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.file.dto.request.ConfirmFileUploadRequest;
import kr.flowmeet.api.file.dto.request.CreatePresignedUrlRequest;
import kr.flowmeet.api.file.dto.response.CreatePresignedUrlResponse;
import kr.flowmeet.api.file.dto.response.FileInformationResponse;
import kr.flowmeet.domain.file.entity.FileInformation;
import kr.flowmeet.domain.file.exception.FileErrorCode;
import kr.flowmeet.domain.file.service.FileInformationService;
import kr.flowmeet.external.file.FileStorageService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileFacade {

    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024;

    private final FileInformationService fileInformationService;
    private final FileStorageService fileStorageService;

    public CreatePresignedUrlResponse createPresignedUrl(final CreatePresignedUrlRequest request) {
        validateFileSize(request.fileSize());

        String fileKey = generateFileKey(request.fileName());
        URL presignedUrl = fileStorageService.generatePresignedUrl(fileKey, request.contentType());
        String uploadUrl = fileStorageService.getPublicUrl(fileKey);

        return new CreatePresignedUrlResponse(fileKey, presignedUrl.toString(), uploadUrl);
    }

    @Transactional
    public FileInformationResponse confirmUpload(final ConfirmFileUploadRequest request) {
        if (!fileStorageService.doesObjectExist(request.fileKey())) {
            throw new ApiException(FileErrorCode.FILE_UPLOAD_NOT_COMPLETED);
        }

        FileInformation fileInformation = fileInformationService.create(
                fileStorageService.getPublicUrl(request.fileKey()),
                request.toCommand()
        );

        return FileInformationResponse.from(fileInformation);
    }

    @Transactional
    public void deleteFile(final String fileKey) {
        FileInformation fileInformation = fileInformationService.findByFileKey(fileKey);
        fileStorageService.deleteObject(fileKey);
        fileInformationService.delete(fileInformation);
    }

    private void validateFileSize(final long fileSize) {
        if (fileSize > MAX_FILE_SIZE) {
            throw new ApiException(FileErrorCode.FILE_SIZE_EXCEEDED);
        }
    }

    private String generateFileKey(final String fileName) {
        return "files/" + UUID.randomUUID() + "_" + fileName;
    }
}
