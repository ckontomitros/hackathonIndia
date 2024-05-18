package com.dt.pausepick.services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.dt.pausepick.dto.ActorDetailsDto;

@Service
public class ActorDataHandlingService {

    public List<ActorDetailsDto> getRecognizedActorsDetails(List<String> recognizedActor) {
        List<ActorDetailsDto> recognizedActors = new ArrayList<>();

        for(String actorName : recognizedActor) {
            ActorDetailsDto actorDetails = getActorDetails(actorName);
            if(actorDetails != null) {
                actorDetails.setName(actorName);
                recognizedActors.add(actorDetails);
            }
        }

        return recognizedActors;
    }

    public ActorDetailsDto getActorDetails(String actorName) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        headers.add("Accept", "*/*");
        headers.add("Accept-Encoding", "gzip, deflate, br");
        headers.add("x-api-key", "DY4BKFuLfYaEgFNQC08Vhg==EyjDS18rNyuxRXx1");
        HttpEntity<String> requestEntity = new HttpEntity<>("", headers);

        ActorDetailsDto[] actorDetailsDto = restTemplate.exchange("https://api.api-ninjas.com/v1/celebrity?name=" + actorName, HttpMethod.GET,
                requestEntity, ActorDetailsDto[].class).getBody();

        return actorDetailsDto != null && actorDetailsDto.length > 0 ? actorDetailsDto[0] : null;
    }


}
