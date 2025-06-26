package com.taewoo.silenth.util;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
public class FileUploader {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        if (uploadDir.startsWith("~/")) {
            String homeDir = System.getProperty("user.home");
            uploadDir = uploadDir.replace("~/", homeDir + File.separator);
        }
    }

    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        if (multipartFile.isEmpty()) {
            return null;
        }

        String realPath = uploadDir + dirName;
        File directory = new File(realPath);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리 없으면 생성
        }

        String originalFilename = multipartFile.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String savedFilename = UUID.randomUUID() + extension;

        File savedFile = new File(directory, savedFilename);
        multipartFile.transferTo(savedFile);

        return "/images/" + dirName + "/" + savedFilename;
    }
}
