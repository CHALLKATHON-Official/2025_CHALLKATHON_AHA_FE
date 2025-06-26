package com.taewoo.silenth.service.echo;

import com.taewoo.silenth.web.dto.postDto.EchoResponse;

public interface EchoService {
    EchoResponse toggleEcho(Long userId, Long postId);
}
