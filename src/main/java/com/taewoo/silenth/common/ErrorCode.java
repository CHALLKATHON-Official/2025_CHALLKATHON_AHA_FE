package com.taewoo.silenth.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "입력값이 올바르지 않습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C002", "서버 오류입니다."),

    // User
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "U001", "이미 사용 중인 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "U002", "이미 사용 중인 닉네임입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U003", "사용자를 찾을 수 없습니다."),
    PASSWORD_MISMATCH(HttpStatus.UNAUTHORIZED, "U004", "비밀번호가 일치하지 않습니다."),
    SAME_NICKNAME(HttpStatus.CONFLICT, "U005", "현재 닉네임과 동일합니다."),
    LOGINID_ALREADY_EXISTS(HttpStatus.CONFLICT, "U006", "이미 사용 중인 아이디입니다."),

    // File
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "F001", "파일 크기가 5MB를 초과할 수 없습니다."),

    // SilentPost
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "해당 게시글을 찾을 수 없습니다."),
    EMPTY_EMOTION_TAGS(HttpStatus.BAD_REQUEST, "P002", "감정 태그는 최소 1개 이상이어야 합니다."),
    CONTENT_TOO_LONG(HttpStatus.BAD_REQUEST, "P003", "내용이 너무 깁니다."),
    ALREADY_ARCHIVED(HttpStatus.CONFLICT, "P004", "이미 아카이빙된 게시글입니다."),
    UNAUTHORIZED_POST_ACCESS(HttpStatus.UNAUTHORIZED, "P005", "해당 게시글에 대한 권한이 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
