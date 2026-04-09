package kr.flowmeet.external.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String uploadProfileImage(Long userId, MultipartFile file);
}
