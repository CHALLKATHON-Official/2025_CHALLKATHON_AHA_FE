package com.taewoo.silenth.repository;

import com.taewoo.silenth.common.TimeSlot;
import com.taewoo.silenth.web.entity.CollectiveEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectiveEntryRepository extends JpaRepository<CollectiveEntry, Long> {
    Page<CollectiveEntry> findByTimeSlotOrderByOriginalCreatedAtDesc(TimeSlot timeSlot, Pageable pageable);
}
