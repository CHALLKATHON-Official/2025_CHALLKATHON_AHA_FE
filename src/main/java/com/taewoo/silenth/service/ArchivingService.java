package com.taewoo.silenth.service;

import com.taewoo.silenth.repository.CollectiveEntryRepository;
import com.taewoo.silenth.repository.SilentPostRepository;
import com.taewoo.silenth.web.entity.CollectiveEntry;
import com.taewoo.silenth.web.entity.SilentPost;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArchivingService {

    private final SilentPostRepository silentPostRepository;
    private final CollectiveEntryRepository collectiveEntryRepository;

    @Transactional
    public void archiveOldPosts() {
        // 7일 이전의 기록부터 아카이빙 대상으로 선정
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        List<SilentPost> postsToArchive = silentPostRepository.findByArchivedFalseAndConsentToArchiveTrueAndCreatedAtBefore(threshold);

        if (postsToArchive.isEmpty()) {
            // ErrorCode 사용보다는 log 사용이 맞음
            log.info("No posts to archive.");
            return;
        }

        log.info("Archiving {} posts older than {}", postsToArchive.size(), threshold);

        // CollectiveEntry 리스트로 변환
        List<CollectiveEntry> collectiveEntries = postsToArchive.stream()
                .map(post -> CollectiveEntry.builder().originalPost(post).build())
                .collect(Collectors.toList());

        collectiveEntryRepository.saveAll(collectiveEntries);

        postsToArchive.forEach(SilentPost::archive);
    }
}
