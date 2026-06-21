package com.padaria.dto;

public class UpdateProfileRequest {

    private String name;
    private String username;

    public UpdateProfileRequest() {
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}