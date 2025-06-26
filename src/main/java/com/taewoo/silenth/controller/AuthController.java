package com.taewoo.silenth.controller;

import com.taewoo.silenth.service.AuthService;
import com.taewoo.silenth.web.dto.authDto.LoginRequest;
import com.taewoo.silenth.web.dto.authDto.SignUpRequest;
import com.taewoo.silenth.web.dto.authDto.TokenRefreshRequest;
import com.taewoo.silenth.web.dto.authDto.TokenResponse;
import com.taewoo.silenth.web.dto.commonResponse.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        authService.signUp(signUpRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.onSuccessWithMessage("회원가입이 성공적으로 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid  @RequestBody LoginRequest loginRequest) {
        TokenResponse token = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.onSuccessWithData(token));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(@Valid @RequestBody TokenRefreshRequest tokenRefreshRequest) {
        TokenResponse newTokens = authService.refreshToken(tokenRefreshRequest.refreshToken());
        return ResponseEntity.ok(ApiResponse.onSuccessWithData(newTokens));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody TokenRefreshRequest tokenRefreshRequest) {
        authService.logout(tokenRefreshRequest.refreshToken());
        return ResponseEntity.ok(ApiResponse.onSuccessWithMessage("로그아웃이 성공적으로 완료되었습니다."));
    }
}
