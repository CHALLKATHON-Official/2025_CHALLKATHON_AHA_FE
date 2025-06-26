package com.taewoo.silenth.web.dto;

import com.taewoo.silenth.web.entity.CollectiveEntry;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CollectiveEntryResponse {
    private final Long entryId;
    private final String content;
    private final int eraYear;
    private final int eraMonth;
    private final LocalDateTime originalCreatedAt;

    public CollectiveEntryResponse(CollectiveEntry entry) {
        this.entryId = entry.getId();
        this.content = entry.getContent();
        this.eraYear = entry.getEraYear();
        this.eraMonth = entry.getEraMonth();
        this.originalCreatedAt = entry.getOriginalCreatedAt();
    }
}
