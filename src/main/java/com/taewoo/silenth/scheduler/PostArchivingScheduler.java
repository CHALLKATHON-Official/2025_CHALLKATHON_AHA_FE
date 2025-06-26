package com.taewoo.silenth.scheduler;

import com.taewoo.silenth.service.ArchivingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PostArchivingScheduler {

    private final ArchivingService archivingService;

    // 매일 새벽 5시에 실행
    @Scheduled(cron = "0 0 5 * * *")
    public void runDailyArchiving() {
        log.info("Starting daily post archiving job...");
        archivingService.archiveOldPosts();
        log.info("Finished daily post archiving job.");
    }
}
