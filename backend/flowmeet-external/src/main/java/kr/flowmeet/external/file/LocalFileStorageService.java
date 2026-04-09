package kr.flowmeet.external.file;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.external.exception.ExternalException;
import kr.flowmeet.external.file.exception.FileStorageErrorCode;

@Service
public class LocalFileStorageService implements FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/png", "image/jpeg", "image/webp");

    @Override
    public String uploadProfileImage(final Long userId, final MultipartFile file) {
        validateImageFile(file);

        // TODO: 외부 스토리지 연동 후 실제 업로드 로직으로 교체
        return "https://cdn.flowmeet.com/profiles/" + userId + ".png";
    }

    private void validateImageFile(final MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ExternalException(FileStorageErrorCode.FILE_SIZE_EXCEEDED);
        }

        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new ExternalException(FileStorageErrorCode.FILE_INVALID_TYPE);
        }
    }
}