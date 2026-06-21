package com.padaria.service;

import com.padaria.dto.ChangePasswordRequest;
import com.padaria.dto.ProfileResponse;
import com.padaria.dto.UpdateProfileRequest;
import com.padaria.model.Company;
import com.padaria.model.User;
import com.padaria.repository.CompanyRepository;
import com.padaria.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public ProfileService(UserRepository userRepository, CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    public ProfileResponse getProfile(Long userId) {
        User user = findUser(userId);

        ProfileResponse response = new ProfileResponse();

        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setName(user.getName());
        response.setRole(normalizeRole(user.getRole()));
        response.setActive(user.getActive());

        Company company = findCompanyForUser(user);

        if (company != null) {
            fillCompanyData(response, company);
        }

        response.setPermissions(buildPermissions(user.getRole()));

        return response;
    }

    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUser(userId);

        if (request == null) {
            throw new IllegalArgumentException("Informe os dados do perfil.");
        }

        String newName = trimToEmpty(request.getName());
        String newUsername = trimToEmpty(request.getUsername());

        if (newName.isEmpty()) {
            throw new IllegalArgumentException("O nome não pode ser vazio.");
        }

        if (newName.length() < 3) {
            throw new IllegalArgumentException("O nome deve ter pelo menos 3 caracteres.");
        }

        if (newUsername.isEmpty()) {
            throw new IllegalArgumentException("O usuário não pode ser vazio.");
        }

        if (newUsername.length() < 3) {
            throw new IllegalArgumentException("O usuário deve ter pelo menos 3 caracteres.");
        }

        Optional<User> userWithSameUsername = userRepository.findByUsername(newUsername);

        if (userWithSameUsername.isPresent() && !userWithSameUsername.get().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Este nome de usuário já está em uso.");
        }

        int updatedRows = userRepository.updateProfileById(
                user.getId(),
                newName,
                newUsername,
                System.currentTimeMillis()
        );

        if (updatedRows == 0) {
            throw new IllegalArgumentException("Não foi possível atualizar os dados do perfil.");
        }

        return getProfile(user.getId());
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findUser(userId);

        if (request == null) {
            throw new IllegalArgumentException("Informe os dados para alterar a senha.");
        }

        String currentPassword = trimToEmpty(request.getCurrentPassword());
        String newPassword = trimToEmpty(request.getNewPassword());
        String confirmPassword = trimToEmpty(request.getConfirmPassword());
        String savedPassword = trimToEmpty(user.getPassword());

        if (currentPassword.isEmpty()) {
            throw new IllegalArgumentException("Informe a senha atual.");
        }

        if (savedPassword.isEmpty()) {
            throw new IllegalArgumentException("Este usuário não possui senha cadastrada.");
        }

        if (!currentPassword.equals(savedPassword)) {
            throw new IllegalArgumentException("Senha atual incorreta.");
        }

        if (newPassword.isEmpty()) {
            throw new IllegalArgumentException("Informe a nova senha.");
        }

        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter pelo menos 6 caracteres.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("A confirmação da nova senha não confere.");
        }

        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException("A nova senha precisa ser diferente da senha atual.");
        }

        int updatedRows = userRepository.updatePasswordById(
                user.getId(),
                newPassword,
                System.currentTimeMillis()
        );

        if (updatedRows == 0) {
            throw new IllegalArgumentException("Não foi possível atualizar a senha.");
        }
    }

    private User findUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Usuário inválido.");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    private Company findCompanyForUser(User user) {
        Long companyId = user.getCompanyId();

        if (companyId != null) {
            Optional<Company> userCompany = companyRepository.findById(companyId);

            if (userCompany.isPresent()) {
                return userCompany.get();
            }
        }

        List<Company> companies = companyRepository.findAll();

        Optional<Company> systemCompany = companies.stream()
                .filter(company -> Boolean.TRUE.equals(company.getSistema()))
                .findFirst();

        if (systemCompany.isPresent()) {
            return systemCompany.get();
        }

        Optional<Company> matrizCompany = companies.stream()
                .filter(company -> "MATRIZ".equalsIgnoreCase(trimToEmpty(company.getTipo())))
                .findFirst();

        return matrizCompany.orElse(null);
    }

    private void fillCompanyData(ProfileResponse response, Company company) {
        response.setCompanyId(company.getId());
        response.setCompanyName(getCompanyName(company));
        response.setCompanyType(company.getTipo());
        response.setCompanyCnpj(company.getCnpj());
        response.setCompanyEndereco(company.getEndereco());
        response.setMatrizId(company.getMatrizId());

        if (company.getMatrizId() != null) {
            companyRepository.findById(company.getMatrizId())
                    .ifPresent(matriz -> response.setMatrizName(getCompanyName(matriz)));
        }
    }

    private String getCompanyName(Company company) {
        if (company == null) {
            return "";
        }

        if (company.getNome() != null && !company.getNome().trim().isEmpty()) {
            return company.getNome();
        }

        return company.getRazaoSocial();
    }

    private List<String> buildPermissions(String role) {
        List<String> permissions = new ArrayList<>();

        String normalizedRole = normalizeRole(role);

        permissions.add("Visualizar dashboard");
        permissions.add("Visualizar produtos");
        permissions.add("Consultar dados");

        if (normalizedRole.equals("ADMIN")) {
            permissions.add("Cadastrar e editar produtos");
            permissions.add("Registrar vendas");
            permissions.add("Registrar desperdícios");
            permissions.add("Gerenciar empresas e filiais");
            permissions.add("Gerenciar usuários");
            permissions.add("Alterar permissões de usuários");
            return permissions;
        }

        if (normalizedRole.equals("GERENTE")) {
            permissions.add("Cadastrar e editar produtos");
            permissions.add("Registrar vendas");
            permissions.add("Registrar desperdícios");
            return permissions;
        }

        if (normalizedRole.equals("ATENDENTE")) {
            permissions.add("Registrar vendas");
            return permissions;
        }

        if (normalizedRole.equals("ESTOQUISTA")) {
            permissions.add("Cadastrar e editar produtos");
            permissions.add("Registrar desperdícios");
            return permissions;
        }

        permissions.add("Registrar vendas");

        return permissions;
    }

    private String normalizeRole(String role) {
        String normalizedRole = trimToEmpty(role).toUpperCase();

        if (normalizedRole.isEmpty()) {
            return "USER";
        }

        if (
                !normalizedRole.equals("ADMIN") &&
                !normalizedRole.equals("USER") &&
                !normalizedRole.equals("GERENTE") &&
                !normalizedRole.equals("ATENDENTE") &&
                !normalizedRole.equals("ESTOQUISTA")
        ) {
            return "USER";
        }

        return normalizedRole;
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}