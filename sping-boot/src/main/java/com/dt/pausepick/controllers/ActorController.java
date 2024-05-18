package com.dt.pausepick.controllers;

import com.dt.pausepick.dto.Dtos;
import com.dt.pausepick.services.ActorDataHandlingService;
import com.dt.pausepick.services.ActorRecognitionService;
import com.dt.pausepick.services.WorkItem;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/actor")
@CrossOrigin
public class ActorController {
    private final ActorRecognitionService actorRecognitionService;
    private final ActorDataHandlingService actorDataHandlingService;

    public ActorController(ActorRecognitionService actorRecognitionService, ActorDataHandlingService actorDataRetrievalService) {
        this.actorRecognitionService = actorRecognitionService;
        this.actorDataHandlingService = actorDataRetrievalService;
    }

    @PostMapping(value = "/labels", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<WorkItem> getLabels(@RequestParam("image") MultipartFile image) throws Exception {
        byte[] bytes = image.getBytes();
        String name = image.getOriginalFilename();
        return actorRecognitionService.detectLabels(bytes, name);
    }

    @PostMapping(value = "/names", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Dtos.Person> getActorNames(@RequestParam("image") MultipartFile image) throws Exception {
        byte[] bytes = image.getBytes();
        String name = image.getOriginalFilename();
        return actorRecognitionService.recognizeActor(bytes, name);
    }
}
