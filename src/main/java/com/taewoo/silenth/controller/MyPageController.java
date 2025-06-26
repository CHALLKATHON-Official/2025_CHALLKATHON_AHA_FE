package com.taewoo.silenth.controller;

import com.taewoo.silenth.config.UserPrincipal;
import com.taewoo.silenth.service.MyPageService;
import com.taewoo.silenth.service.postService.SilentPostService;
import com.taewoo.silenth.web.dto.commonResponse.ApiResponse;
import com.taewoo.silenth.web.dto.mypageDto.MyPageResponse;
import com.taewoo.silenth.web.dto.mypageDto.NicknameUpdateRequest;
import com.taewoo.silenth.web.dto.postDto.PostResponse;
import com.taewoo.silenth.web.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final SilentPostService silentPostService;

    @GetMapping
    public ResponseEntity<ApiResponse<MyPageResponse>> getMyPageInfo(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        MyPageResponse myPageInfo = myPageService.getMyPageInfo(userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.onSuccessWithData(myPageInfo));
    }

    @PatchMapping("/username")
    public ResponseEntity<ApiResponse<Void>> updateNickname(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody NicknameUpdateRequest request
    ) {
        User loginUser = userPrincipal.getUser();
        myPageService.updateNickname(loginUser.getId(), request.getNickname());
        return ResponseEntity.ok(ApiResponse.onSuccessWithMessage("닉네임이 성공적으로 변경되었습니다."));
    }

    @PostMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateProfileImage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart("image") MultipartFile profileImage
    ) throws IOException {
        User loginUser = userPrincipal.getUser();
        String profileImageUrl = myPageService.updateProfileImage(loginUser.getId(), profileImage);
        return ResponseEntity.ok(ApiResponse.onSuccessWithData(profileImageUrl));
    }

    @GetMapping("/posts")
    @Operation(summary = "내가 작성한 감정 기록 조회", description = "로그인한 사용자가 작성한 감정 기록 목록을 최신순으로 페이징하여 조회합니다.")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getMyPosts(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable
            ) {
        Page<PostResponse> myPosts = silentPostService.getMyPosts(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.onSuccessWithData(myPosts));
    }
}