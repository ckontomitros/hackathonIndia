package com.dt.pausepick.services;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.Celebrity;
import software.amazon.awssdk.services.rekognition.model.DetectLabelsRequest;
import software.amazon.awssdk.services.rekognition.model.DetectLabelsResponse;
import software.amazon.awssdk.services.rekognition.model.Image;
import software.amazon.awssdk.services.rekognition.model.Label;
import software.amazon.awssdk.services.rekognition.model.RecognizeCelebritiesRequest;
import software.amazon.awssdk.services.rekognition.model.RecognizeCelebritiesResponse;
import software.amazon.awssdk.services.rekognition.model.RekognitionException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActorRecognitionService {
    public List<WorkItem> detectLabels(byte[] bytes, String key) {
        try {
            RekognitionClient rekClient = getClient();

            Image souImage = getImage(bytes);

            DetectLabelsRequest detectLabelsRequest = DetectLabelsRequest.builder()
                    .image(souImage)
                    .maxLabels(10)
                    .build();

            DetectLabelsResponse labelsResponse = rekClient.detectLabels(detectLabelsRequest);
            List<Label> labels = labelsResponse.labels();
            ArrayList<WorkItem> list = new ArrayList<>();
            WorkItem item;
            for (Label label : labels) {
                item = new WorkItem();
                item.setKey(key); // identifies the photo
                item.setConfidence(label.confidence().toString());
                item.setName(label.name());
                list.add(item);
            }
            return list;

        } catch (RekognitionException e) {
            System.out.println(e.getMessage());
            System.exit(1);
        }
        return null;
    }

    public List<String> recognizeActor(byte[] bytes, String key) {
        RekognitionClient rekClient = getClient();

        Image souImage = getImage(bytes);
        RecognizeCelebritiesRequest request = RecognizeCelebritiesRequest.builder().image(souImage).build();
        RecognizeCelebritiesResponse result = rekClient.recognizeCelebrities(request);
        return result.celebrityFaces().stream()
                .map(Celebrity::name).toList();
    }

    private static Image getImage(byte[] bytes) {
        SdkBytes sourceBytes = SdkBytes.fromByteArray(bytes);
        return Image.builder()
                .bytes(sourceBytes)
                .build();
    }

    private static RekognitionClient getClient() {
        return RekognitionClient.builder()
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .region(Region.US_EAST_1)
                .build();
    }
}