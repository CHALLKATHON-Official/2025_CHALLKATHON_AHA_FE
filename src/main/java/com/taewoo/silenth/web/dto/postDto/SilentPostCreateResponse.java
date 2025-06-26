package com.taewoo.silenth.web.dto.postDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SilentPostCreateResponse {
    private Long postId;
    private String message;
}