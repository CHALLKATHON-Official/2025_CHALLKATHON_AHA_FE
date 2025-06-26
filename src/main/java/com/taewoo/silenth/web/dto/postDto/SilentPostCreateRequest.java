package com.taewoo.silenth.web.dto.postDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SilentPostCreateRequest {

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @NotEmpty(message = "감정 태그는 1개 이상 입력되어야 합니다.")
    private List<Long> emotionTagIds;

    private Boolean isAnonymous;
}