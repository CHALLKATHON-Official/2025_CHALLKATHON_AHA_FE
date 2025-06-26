package com.taewoo.silenth.service;

import com.taewoo.silenth.common.ErrorCode;
import com.taewoo.silenth.exception.BusinessException;
import com.taewoo.silenth.repository.UserRepository;
import com.taewoo.silenth.util.FileUploader;
import com.taewoo.silenth.web.dto.mypageDto.MyPageResponse;
import com.taewoo.silenth.web.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final UserRepository userRepository;
    private final FileUploader fileUploader;

    @Transactional(readOnly = true)
    public MyPageResponse getMyPageInfo(User user) {
        return new MyPageResponse(user);
    }

    public void updateNickname(Long userId, String newNickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getNickname().equals(newNickname)) {
            throw new BusinessException(ErrorCode.SAME_NICKNAME);
        }

        if (userRepository.existsByNickname(newNickname)) {
            throw new BusinessException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        user.updateNickname(newNickname);
    }

    public String updateProfileImage(Long userId, MultipartFile profileImage) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String profileImageUrl = fileUploader.upload(profileImage, "profile");
        user.updateProfilePicture(profileImageUrl);
        return profileImageUrl;
    }
}
