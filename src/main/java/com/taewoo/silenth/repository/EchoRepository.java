package com.taewoo.silenth.repository;

import com.taewoo.silenth.web.entity.Echo;
import com.taewoo.silenth.web.entity.SilentPost;
import com.taewoo.silenth.web.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EchoRepository extends JpaRepository<Echo, Long> {
    Optional<Echo> findByUserAndSilentPost(User user, SilentPost silentPost);
}
