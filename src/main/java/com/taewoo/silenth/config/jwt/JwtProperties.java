package com.taewoo.silenth.config.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt.token")
public record JwtProperties(
        String secretKey,
        Expiration expiration
) {
    public record Expiration(
            Long access,
            Long refresh
    ) {}
}
