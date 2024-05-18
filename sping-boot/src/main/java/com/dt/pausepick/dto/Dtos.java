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
                            celebrity.face().boundingBox().left(),
                            celebrity.face().boundingBox().top(),
                            celebrity.face().boundingBox().width(),
                            celebrity.face().boundingBox().height()
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
            Float left,
            Float top,
            Float width,
            Float height
    ) {
    }


}

