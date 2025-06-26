package com.taewoo.silenth.web.dto.commonResponse;

import java.time.LocalDateTime;

public record ErrorResponse(
        String errorCode,
        String message,
        LocalDateTime timeStamp
) {}
