package kr.flowmeet.api.file.scheduler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import kr.flowmeet.domain.file.entity.FileInformation;
import kr.flowmeet.domain.file.service.FileInformationService;
import kr.flowmeet.external.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TempFileCleanupScheduler {

    private static final int TEMP_FILE_EXPIRY_HOURS = 24;

    private final FileInformationService fileInformationService;
    private final FileStorageService fileStorageService;

    @Scheduled(cron = "0 0 3 * * *", zone = "Asia/Seoul")
    public void cleanupTempFiles() {
        LocalDateTime expiredAt = LocalDateTime.now().minusHours(TEMP_FILE_EXPIRY_HOURS);
        List<FileInformation> expiredFiles = fileInformationService.findAllExpiredTempFiles(expiredAt);

        if (expiredFiles.isEmpty()) {
            return;
        }

        List<Long> deletedFileIds = new ArrayList<>();
        for (FileInformation file : expiredFiles) {
            try {
                fileStorageService.deleteObject(file.getFileKey());
                deletedFileIds.add(file.getId());
            } catch (Exception e) {
                log.error("[TempFileCleanupScheduler] S3 삭제 실패. fileKey={}", file.getFileKey(), e);
            }
        }

        if (!deletedFileIds.isEmpty()) {
            fileInformationService.deleteAllByIds(deletedFileIds);
        }
        log.info("[TempFileCleanupScheduler] TEMP 파일 정리 완료. 대상={}건, 삭제={}건", expiredFiles.size(), deletedFileIds.size());
    }
}