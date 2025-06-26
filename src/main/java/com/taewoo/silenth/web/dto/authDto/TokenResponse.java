package com.taewoo.silenth.web.dto.authDto;

public record TokenResponse(String grantType, String accessToken, String refreshToken) {}
