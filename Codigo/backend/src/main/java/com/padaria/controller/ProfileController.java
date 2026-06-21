package com.padaria.controller;

import com.padaria.dto.ChangePasswordRequest;
import com.padaria.dto.ProfileResponse;
import com.padaria.dto.UpdateProfileRequest;
import com.padaria.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(profileService.getProfile(userId));
        } catch (Exception error) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message",
                    error.getMessage() != null ? error.getMessage() : "Erro ao carregar perfil."
            ));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequest request
    ) {
        try {
            ProfileResponse updatedProfile = profileService.updateProfile(userId, request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception error) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message",
                    error.getMessage() != null ? error.getMessage() : "Erro ao atualizar dados do perfil."
            ));
        }
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            profileService.changePassword(userId, request);

            return ResponseEntity.ok(Map.of(
                    "message", "Senha alterada com sucesso."
            ));
        } catch (Exception error) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message",
                    error.getMessage() != null ? error.getMessage() : "Erro ao alterar senha."
            ));
        }
    }
}