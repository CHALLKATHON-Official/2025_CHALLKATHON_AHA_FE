package com.taewoo.silenth.web.entity;

import com.taewoo.silenth.common.TimeSlot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectiveEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_post_id", unique = true)
    private SilentPost originalPost;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int eraYear;

    @Column(nullable = false)
    private int eraMonth;

    @Column(nullable = false)
    private LocalDateTime originalCreatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeSlot timeSlot;

    @Builder
    public CollectiveEntry(SilentPost originalPost) {
        this.originalPost = originalPost;
        this.content = originalPost.getContent();
        this.originalCreatedAt = originalPost.getCreatedAt();
        this.eraYear = originalPost.getCreatedAt().getYear();
        this.eraMonth = originalPost.getCreatedAt().getMonthValue();
        this.timeSlot = TimeSlot.Eof(originalPost.getCreatedAt().toLocalTime());
    }
}
