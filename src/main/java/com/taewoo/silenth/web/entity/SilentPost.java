package com.taewoo.silenth.web.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class SilentPost extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private boolean archived = false;   // 아카이빙 여부

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // EmotionTag 연관관계 (N:M → 중간 테이블 필요. 일단 무시하거나 추후 매핑)
    // 추후: @ManyToMany or 중간 엔티티로 구현
    @ManyToMany
    @JoinTable(
            name = "silent_post_emotion_tag",
            joinColumns = @JoinColumn(name = "silent_post_id"),
            inverseJoinColumns = @JoinColumn(name = "emotion_tag_id")
    )
    private List<EmotionTag> emotionTags = new ArrayList<>();

    @OneToMany(mappedBy = "silentPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Echo> echos = new ArrayList<>();

    @Column(nullable = false)
    private boolean consentToArchive = false;

    @Column(nullable = false)
    private boolean isAnonymous = true;

    public void giveConsent() {
        this.consentToArchive = true;
    }

    public int getEchoCount() {
        return this.echos.size();
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setEmotionTags(List<EmotionTag> tags) {
        this.emotionTags = tags;
    }

    public void archive() {
        this.archived = true;
    }

}