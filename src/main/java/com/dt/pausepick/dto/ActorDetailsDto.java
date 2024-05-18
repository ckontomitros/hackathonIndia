package com.dt.pausepick.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ActorDetailsDto {

    private String name;
    private int net_worth;
    private String gender;
    private String nationality;
    private double height;
    private String birthday;
    private int age;

}
