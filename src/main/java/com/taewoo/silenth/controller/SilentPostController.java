package com.taewoo.silenth.controller;

import com.taewoo.silenth.config.UserPrincipal;
import com.taewoo.silenth.web.dto.commonResponse.ErrorResponse;
import com.taewoo.silenth.web.dto.postDto.PostResponse;
import com.taewoo.silenth.web.dto.postDto.SilentPostCreateRequest;
import com.taewoo.silenth.web.dto.postDto.SilentPostCreateResponse;
import com.taewoo.silenth.service.postService.SilentPostService;
import com.taewoo.silenth.web.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.extern.slf4j.Slf4j;


@Tag(name = "SilentPost", description = "감정 기록 API")
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
public class SilentPostController {

    private final SilentPostService silentPostService;

    @PostMapping
    @Operation(
            summary = "감정 기록 작성",
            description = "사용자의 감정을 실시간으로 작성합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "작성 성공",
                            content = @Content(schema = @Schema(implementation = SilentPostCreateResponse.class))),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<com.taewoo.silenth.web.dto.commonResponse.ApiResponse<SilentPostCreateResponse>> createPost(
            @RequestBody @Valid SilentPostCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
            ) {
        log.info("요청 본문: {}", request);

        User loginUser = userPrincipal.getUser();
        SilentPostCreateResponse response = silentPostService.createPost(loginUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(com.taewoo.silenth.web.dto.commonResponse.ApiResponse.onSuccessWithData(response));
    }

    @GetMapping
    @Operation(summary = "감정 기록 조회", description = "감정 기록들을 최신 순으로 조회")
    public ResponseEntity<com.taewoo.silenth.web.dto.commonResponse.ApiResponse<Page<PostResponse>>> getPostFeed(Pageable pageable) {
        Page<PostResponse> feed = silentPostService.getPostFeed(pageable);
        return ResponseEntity.ok(com.taewoo.silenth.web.dto.commonResponse.ApiResponse.onSuccessWithData(feed));
    }

    @PatchMapping("/{postId}/consent")
    @Operation(summary = "게시글 아카이빙 동의", description = "특정 게시글을 '공감 연대기'에 포함시키는 것에 동의합니다.")
    public ResponseEntity<com.taewoo.silenth.web.dto.commonResponse.ApiResponse<Void>> giveArchivingConsent(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User loginUser = userPrincipal.getUser();
        silentPostService.giveArchivingConsent(loginUser.getId(), postId);
        return ResponseEntity.ok(com.taewoo.silenth.web.dto.commonResponse.ApiResponse.onSuccessWithMessage("아카이빙에 동의 처리되었습니다."));
    }
}