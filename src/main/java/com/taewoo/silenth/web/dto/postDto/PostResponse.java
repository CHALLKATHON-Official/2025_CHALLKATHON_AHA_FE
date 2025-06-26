package com.taewoo.silenth.web.dto.postDto;

import com.taewoo.silenth.web.entity.EmotionTag;
import com.taewoo.silenth.web.entity.SilentPost;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record PostResponse(
        Long postId,
        String content,
        String authorNickname,
        String authorProfileImageUrl,
        int echoCount,
        LocalDateTime createdAt,
        List<String> tags,
        boolean isAnonymous
) {
    public static PostResponse from(SilentPost post) {
        String nickname = post.isAnonymous() ? "익명의 감정" : post.getUser().getNickname();
        String profileImg = post.isAnonymous() ? "기본 익명_프로필_이미지_URL" : post.getUser().getProfileImageUrl();
        return new PostResponse(
                post.getId(),
                post.getContent(),
                nickname,
                profileImg,
                post.getEchoCount(),
                post.getCreatedAt(),
                post.getEmotionTags().stream()
                        .map(EmotionTag::getTagName)
                        .collect(Collectors.toList()),
                post.isAnonymous()
        );
    }
}
