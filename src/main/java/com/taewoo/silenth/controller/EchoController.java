package com.taewoo.silenth.controller;

import com.taewoo.silenth.config.UserPrincipal;
import com.taewoo.silenth.service.echo.EchoService;
import com.taewoo.silenth.web.dto.commonResponse.ApiResponse;
import com.taewoo.silenth.web.dto.postDto.EchoResponse;
import com.taewoo.silenth.web.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Echo", description = "메아리 API")
@RestController
@RequestMapping("/api/v1/posts/{postId}/echo")
@RequiredArgsConstructor
public class EchoController {

    private final EchoService echoService;

    @PostMapping
    @Operation(summary = "Echo 보내기 / 취소", description = "특정 게시글에 대한 Echo를 보내거나 취소합니다.")
    public ResponseEntity<ApiResponse<EchoResponse>> toggleEcho(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User loginUser = userPrincipal.getUser();
        EchoResponse echoResponse = echoService.toggleEcho(loginUser.getId(), postId);
        return ResponseEntity.ok(ApiResponse.onSuccessWithData(echoResponse));
    }
}
