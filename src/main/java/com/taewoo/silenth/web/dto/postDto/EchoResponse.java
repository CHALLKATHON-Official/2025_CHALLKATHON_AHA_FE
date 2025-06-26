package com.taewoo.silenth.web.dto.postDto;

public record EchoResponse(
        int echoCount,
        boolean isEchoed
) {
}
