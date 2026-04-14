package kr.flowmeet.external.file;

import java.io.InputStream;
import java.net.URL;

public interface FileStorageService {

    URL generatePresignedUrl(String fileKey, String contentType);

    String upload(String fileKey, InputStream inputStream, String contentType, long contentLength);

    boolean doesObjectExist(String fileKey);

    void deleteObject(String fileKey);

    String getPublicUrl(String fileKey);
}
