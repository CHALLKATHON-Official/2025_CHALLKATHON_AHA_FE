package com.taewoo.silenth.service.postService;

import com.taewoo.silenth.common.ErrorCode;
import com.taewoo.silenth.exception.BusinessException;
import com.taewoo.silenth.repository.EmotionTagRepository;
import com.taewoo.silenth.repository.SilentPostRepository;
import com.taewoo.silenth.repository.UserRepository;
import com.taewoo.silenth.web.dto.postDto.PostResponse;
import com.taewoo.silenth.web.dto.postDto.SilentPostCreateRequest;
import com.taewoo.silenth.web.dto.postDto.SilentPostCreateResponse;
import com.taewoo.silenth.web.entity.EmotionTag;
import com.taewoo.silenth.web.entity.SilentPost;
import com.taewoo.silenth.web.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SilentPostServiceImpl implements SilentPostService {

    private final UserRepository userRepository;
    private final SilentPostRepository silentPostRepository;
    private final EmotionTagRepository emotionTagRepository;

    @Override
    @Transactional
    public SilentPostCreateResponse createPost(Long userId, SilentPostCreateRequest request) {
        // 1. 사용자 확인
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 2. 감정 태그 유효성 검사
        if (request.getEmotionTagIds() == null || request.getEmotionTagIds().isEmpty()){
            throw new BusinessException(ErrorCode.EMPTY_EMOTION_TAGS);
        }

        // 3. 감정 태그 조회
        List<EmotionTag> emotionTags =  emotionTagRepository.findByIdIn(request.getEmotionTagIds());

        if(emotionTags.size() != request.getEmotionTagIds().size()){
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 4. 게시글 생성 및 연관관계 설정
        SilentPost post = new SilentPost();
        post.setUser(user);
        post.setEmotionTags(emotionTags);
        post.setContent(request.getContent());

        if (request.getIsAnonymous() != null) {
            post.setAnonymous(request.getIsAnonymous());
        }

        SilentPost saved = silentPostRepository.save(post);

        // 5. response 변환
        return new SilentPostCreateResponse(saved.getId(), "작성 완료!");
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<PostResponse> getPostFeed(Pageable pageable) {
        return silentPostRepository.findPostWithUser(pageable).map(PostResponse::from);
    }

    @Override
    @Transactional
    public void giveArchivingConsent(Long userId, Long postId) {
        SilentPost post = silentPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_POST_ACCESS);
        }

        post.giveConsent();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getMyPosts(Long userId, Pageable pageable) {
        return silentPostRepository.findByUserIdWithUser(userId, pageable)
                .map(PostResponse::from);
    }
}