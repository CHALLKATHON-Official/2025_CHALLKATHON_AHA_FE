package com.taewoo.silenth.handler;

import com.taewoo.silenth.common.ErrorCode;
import com.taewoo.silenth.exception.BusinessException;
import com.taewoo.silenth.web.dto.commonResponse.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import com.taewoo.silenth.web.dto.commonResponse.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ApiResponse<ErrorResponse>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("handleMethodArgumentNotValidException", e);
        final ErrorCode errorCode = ErrorCode.INVALID_INPUT_VALUE;
        final ApiResponse<ErrorResponse> response = ApiResponse.onFailure(
                errorCode.getCode(), errorCode.getMessage()
        );

        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    protected ResponseEntity<ApiResponse<ErrorResponse>> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        log.error("handleMaxUploadSizeExceededException", e);
        final ErrorCode errorCode = ErrorCode.FILE_SIZE_EXCEEDED;
        final ApiResponse<ErrorResponse> response = ApiResponse.onFailure(
                errorCode.getCode(), errorCode.getMessage()
        );
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }


    @ExceptionHandler(BusinessException.class)
    protected  ResponseEntity<ApiResponse<ErrorResponse>> handleBusinessException(final BusinessException e) {
        log.error("handleBusinessException", e);
        final ErrorCode errorCode = e.getErrorCode();
        final ApiResponse<ErrorResponse> response = ApiResponse.onFailure(
                errorCode.getCode(), errorCode.getMessage()
        );

        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ApiResponse<ErrorResponse>> handleException(Exception e) {
        log.error("handleException: {}", e.getMessage());

        final ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

        final ApiResponse<ErrorResponse> response = ApiResponse.onFailure(
                errorCode.getCode(), errorCode.getMessage()
        );

        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }
}
