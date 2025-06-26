package com.taewoo.silenth.service;

import com.taewoo.silenth.common.ErrorCode;
import com.taewoo.silenth.common.Role;
import com.taewoo.silenth.config.UserPrincipal;
import com.taewoo.silenth.config.jwt.JwtProvider;
import com.taewoo.silenth.exception.BusinessException;
import com.taewoo.silenth.repository.RefreshTokenRepository;
import com.taewoo.silenth.repository.UserRepository;
import com.taewoo.silenth.web.dto.authDto.LoginRequest;
import com.taewoo.silenth.web.dto.authDto.SignUpRequest;
import com.taewoo.silenth.web.dto.authDto.TokenResponse;
import com.taewoo.silenth.web.entity.RefreshToken;
import com.taewoo.silenth.web.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;

    public void signUp(SignUpRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByLoginId(req.loginId())) {
            throw new BusinessException(ErrorCode.LOGINID_ALREADY_EXISTS);
        }
        if (userRepository.existsByNickname(req.nickname())) {
            throw new BusinessException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .loginId(req.loginId())
                .nickname(req.nickname())
                .role(Role.USER)
                .build();

        userRepository.save(user);
    }

    public TokenResponse login(LoginRequest req) {
        // AuthenticationManager를 통해 인증
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.loginId(), req.password())
        );

        // 인증 -> JWT 토큰 생성
        TokenResponse tokenResponse = jwtProvider.generateToken(authentication);

        // Refresh Token DB에 저장
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userPrincipal.getUser();
        refreshTokenRepository.findByUserId(user.getId())
                .ifPresentOrElse(
                        refreshToken -> refreshToken.updateToken(tokenResponse.refreshToken()),
                        () -> refreshTokenRepository.save(new RefreshToken(user, tokenResponse.refreshToken()))
                );

        return tokenResponse;
    }

    @Transactional(readOnly = true)
    public TokenResponse refreshToken(String refreshTokenValue) {
        // Refresh Token 유효성 검증
        if (!jwtProvider.validateToken(refreshTokenValue)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // DB에서 Refresh Token 조회
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 토큰 정보로 새로운 인증 객체 생성
        User user = refreshToken.getUser();
        Authentication authentication = jwtProvider.getAuthentication(user);

        // 새로운 토큰 생성, Refresh Token 업데이트
        TokenResponse newTokens = jwtProvider.generateToken(authentication);
        refreshToken.updateToken(newTokens.refreshToken());
        refreshTokenRepository.save(refreshToken);

        return newTokens;
    }

    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(refreshTokenRepository::delete);
    }
}
