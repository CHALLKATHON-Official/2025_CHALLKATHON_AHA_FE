package com.taewoo.silenth.web.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "echo",
    uniqueConstraints = {
        @UniqueConstraint(
                name = "echo_uk",
                columnNames = {"user_id", "post_id"}
        )
    }
)
public class Echo extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private SilentPost silentPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public Echo(User user, SilentPost silentPost) {
        this.user = user;
        this.silentPost = silentPost;
    }
}
