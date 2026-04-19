package kr.flowmeet.api.file.facade;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;
import kr.flowmeet.domain.file.exception.FileErrorCode;
import kr.flowmeet.domain.file.service.FileInformationService;
import kr.flowmeet.domain.file.service.vo.CreateFileInformationCommand;
import kr.flowmeet.external.file.FileStorageService;

@Component
@RequiredArgsConstructor
public class ImageUploader {

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/png", "image/jpeg", "image/webp");

    private final FileStorageService fileStorageService;
    private final FileInformationService fileInformationService;

    public String upload(final MultipartFile file, final String directory,
                         final FileDomainType domainType, final Long entityId) {
        validateImageFile(file);
        deleteOldImage(domainType, entityId);

        String extension = extractExtension(file.getOriginalFilename());
        String fileKey = directory + "/" + UUID.randomUUID() + "." + extension;

        try {
            String imageUrl = fileStorageService.upload(fileKey, file.getInputStream(),
                    file.getContentType(), file.getSize());

            FileInformation fileInformation = fileInformationService.create(
                    imageUrl,
                    CreateFileInformationCommand.of(
                            fileKey,
                            file.getOriginalFilename(),
                            extension,
                            file.getSize(),
                            file.getContentType()
                    )
            );
            fileInformationService.attach(fileInformation.getFileKey(), domainType, entityId);

            return imageUrl;
        } catch (IOException e) {
            throw new ApiException(FileErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private void deleteOldImage(final FileDomainType domainType, final Long entityId) {
        fileInformationService.findByDomainTypeAndEntityId(domainType, entityId)
                .ifPresent(oldFile -> {
                    fileStorageService.deleteObject(oldFile.getFileKey());
                    fileInformationService.delete(oldFile);
                });
    }

    private void validateImageFile(final MultipartFile file) {
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new ApiException(FileErrorCode.FILE_SIZE_EXCEEDED);
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new ApiException(FileErrorCode.FILE_INVALID_TYPE);
        }
    }

    private String extractExtension(final String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex == -1 ? "" : fileName.substring(dotIndex + 1);
    }
}