package com.taewoo.silenth.controller;

import com.taewoo.silenth.service.ArchivingService;
import com.taewoo.silenth.web.dto.commonResponse.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "test", description = "개발 환경 테스트용 API")
@RestController
@RequestMapping("/api/v1/test")
@RequiredArgsConstructor
@Profile("dev")
public class TestController {

    private final ArchivingService archivingService;

    @PostMapping("/archive")
    @Operation(summary = "수동 아카이빙 실행", description = "테스트 목적으로 아카이빙 스케쥴러 실행")
    public ResponseEntity<ApiResponse<Void>> manualArchive() {
        archivingService.archiveOldPosts();
        return ResponseEntity.ok(ApiResponse.onSuccessWithMessage("아카이빙 작업이 수동으로 실행"));
    }

}
