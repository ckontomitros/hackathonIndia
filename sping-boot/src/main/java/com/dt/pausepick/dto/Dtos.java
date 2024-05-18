package com.dt.pausepick.dto;

import software.amazon.awssdk.services.rekognition.model.Celebrity;
import software.amazon.awssdk.services.rekognition.model.Emotion;
import software.amazon.awssdk.services.rekognition.model.KnownGender;
import software.amazon.awssdk.services.rekognition.model.Landmark;

import java.util.List;

public class Dtos {
    public record Person(
            List<String> urls,
            String name,
            String id,
            BoundingBox boundingBox,
            Float matchConfidence,
            String knownGender,
            List<String> landmarks,
            List<String> emotions,
            ActorDetailsDto actorDetails
    ) {
        public static Person toPerson(Celebrity celebrity, ActorDetailsDto actorDetails){
            return new Person(
                    celebrity.urls(),
                    celebrity.name(),
                    celebrity.id(),
                    new BoundingBox(
                            Math.round(100*celebrity.face().boundingBox().left()),
                            Math.round(100*celebrity.face().boundingBox().top()),
                                    Math.round(100*celebrity.face().boundingBox().width()),
                                            Math.round(100*celebrity.face().boundingBox().height())
                    ),
                    celebrity.matchConfidence(),
                    celebrity.knownGender().typeAsString(),
                    celebrity.face().landmarks().stream().map(Landmark::typeAsString).toList(),
                    celebrity.face().emotions().stream().map(Emotion::typeAsString).toList(),
                    actorDetails
            );

        }
    }


    public record BoundingBox(
            Integer left,
            Integer top,
            Integer width,
            Integer height
    ) {
    }


}

