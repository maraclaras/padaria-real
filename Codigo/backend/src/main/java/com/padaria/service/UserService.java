package com.padaria.service;

import com.padaria.model.User;
import com.padaria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username Ã© obrigatÃ³rio");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Senha Ã© obrigatÃ³ria");
        }

        user.setUsername(user.getUsername().trim());
        user.setPassword(user.getPassword().trim());

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username jÃ¡ existe");
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }

        if (user.getActive() == null) {
            user.setActive(true);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UsuÃ¡rio nÃ£o encontrado"));

        // Atualiza somente os campos enviados. Isso evita apagar username/nome/cargo
        // quando a tela manda apenas { password: "novaSenha" }.
        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
            Optional<User> userWithSameUsername = userRepository.findByUsername(user.getUsername());
            if (userWithSameUsername.isPresent() && !userWithSameUsername.get().getId().equals(id)) {
                throw new RuntimeException("Username jÃ¡ existe");
            }
            existingUser.setUsername(user.getUsername().trim());
        }

        if (user.getName() != null) {
            existingUser.setName(user.getName());
        }

        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            existingUser.setRole(user.getRole());
        }

        if (user.getActive() != null) {
            existingUser.setActive(user.getActive());
        }

        if (user.getCompanyId() != null) {
            existingUser.setCompanyId(user.getCompanyId());
        }

        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            existingUser.setPassword(user.getPassword().trim());
        }

        return userRepository.update(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("UsuÃ¡rio nÃ£o encontrado");
        }
        
        User user = userOpt.get();
        
        if (!user.getActive()) {
            throw new RuntimeException("UsuÃ¡rio inativo");
        }
        
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Senha incorreta");
        }
        
        return user;
    }
}

