package kr.flowmeet.domain.file.service.vo;

public record CreateFileInformationCommand(
        String fileKey,
        String name,
        String extension,
        long size,
        String contentType
) {

    public static CreateFileInformationCommand of(String fileKey, String name, String extension, long size, String contentType) {
        return new CreateFileInformationCommand(fileKey, name, extension, size, contentType);
    }
}
