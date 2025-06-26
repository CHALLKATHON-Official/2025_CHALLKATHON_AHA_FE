package com.taewoo.silenth.web.dto.mypageDto;

import com.taewoo.silenth.web.entity.User;
import lombok.Getter;

@Getter
public class MyPageResponse {
    private final String email;
    private final String nickname;
    private final String profileImageUrl;

    public MyPageResponse(User user) {
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.profileImageUrl = user.getProfileImageUrl();
    }
}
