package com.taewoo.silenth.web.dto.mypageDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NicknameUpdateRequest {
    @NotBlank(message = "새 닉네임은 필수입니다.")
    @Size(min = 2, max = 10, message = "닉네임은 2글자 이상, 10글자 이하로 입력해주세요.")
    private String nickname;
}
