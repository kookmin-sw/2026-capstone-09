package kr.flowmeet.domain.file.service.vo;

public record CreateFileInformationCommand(
        String fileKey,
        String name,
        String extension,
        long size,
        String contentType
) {
}
