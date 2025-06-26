package com.taewoo.silenth.repository;

import com.taewoo.silenth.web.entity.SilentPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SilentPostRepository extends JpaRepository<SilentPost, Long> {
    // N + 1 문제 방지용 쿼리
    @Query("select p from SilentPost p join fetch p.user order by p.createdAt desc ")
    Page<SilentPost> findPostWithUser(Pageable pageable);

    @Query("SELECT COUNT(e) FROM Echo e WHERE e.silentPost.id = :postId")
    int countEchosByPostId(@Param("postId") Long postId);

    // 아직 아카이빙 되지 않은 게시글 조회 (특정 시간 이전)
    List<SilentPost> findByArchivedFalseAndConsentToArchiveTrueAndCreatedAtBefore(LocalDateTime threshold);

    @Query("select p from SilentPost p " +
            "join fetch p.user u " +
            "where u.id = :userId order by p.createdAt desc")
    Page<SilentPost> findByUserIdWithUser(@Param("userId") Long userId, Pageable pageable);
}