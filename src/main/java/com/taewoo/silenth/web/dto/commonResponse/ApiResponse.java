package com.taewoo.silenth.web.dto.commonResponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ApiResponse<T> {

    private final String status;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private T data;

    private final String message;

    // 생성자 private -> static factory method만 사용
    private ApiResponse(String status, T data, String message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }

    // 성공 응답 -> 데이터 포함
    public static <T> ApiResponse<T> onSuccessWithData(T data) {
        return new ApiResponse<>("SUCCESS", data, null);
    }

    // 성공 응답 -> 데이터 미포함, 메세지만
    public static ApiResponse<Void> onSuccessWithMessage(String message) {
        return new ApiResponse<>("SUCCESS", null, message);
    }

    // 실패 응답
    public static ApiResponse<ErrorResponse> onFailure(String errorCode, String message) {
        ErrorResponse errorResponse = new ErrorResponse(errorCode, message, LocalDateTime.now());
        return new ApiResponse<>("FAILURE", errorResponse, null);
    }
}
