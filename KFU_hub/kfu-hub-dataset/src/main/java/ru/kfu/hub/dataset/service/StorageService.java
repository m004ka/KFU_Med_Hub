package ru.kfu.hub.dataset.service;

import io.minio.*;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Profile("!local")
public class StorageService {

    private final MinioClient minioClient;

    @Value("${minio.buckets.datasets}")
    private String datasetsBucket;

    @Value("${minio.buckets.previews}")
    private String previewsBucket;

    public StorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public String uploadDataset(UUID datasetId, MultipartFile file) {
        String key = "datasets/" + datasetId + "/" + file.getOriginalFilename();
        try {
            ensureBucketExists(datasetsBucket);
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(datasetsBucket)
                    .object(key)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
            return key;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка загрузки файла в хранилище", e);
        }
    }

    public String getPresignedDownloadUrl(String storageKey) {
        try {
            return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .bucket(datasetsBucket)
                    .object(storageKey)
                    .method(Method.GET)
                    .expiry(1, TimeUnit.HOURS)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка получения ссылки на файл", e);
        }
    }

    public void deleteDataset(String storageKey) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(datasetsBucket)
                    .object(storageKey)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка удаления файла из хранилища", e);
        }
    }

    private void ensureBucketExists(String bucket) throws Exception {
        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }
    }
}
