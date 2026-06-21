package com.padaria.dto;

import java.util.ArrayList;
import java.util.List;

public class ProfileResponse {
    private Long userId;
    private String username;
    private String name;
    private String role;
    private Boolean active;
    private Long companyId;
    private String companyName;
    private String companyType;
    private String companyCnpj;
    private String companyEndereco;
    private Long matrizId;
    private String matrizName;
    private List<String> permissions = new ArrayList<>();

    public ProfileResponse() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCompanyType() { return companyType; }
    public void setCompanyType(String companyType) { this.companyType = companyType; }
    public String getCompanyCnpj() { return companyCnpj; }
    public void setCompanyCnpj(String companyCnpj) { this.companyCnpj = companyCnpj; }
    public String getCompanyEndereco() { return companyEndereco; }
    public void setCompanyEndereco(String companyEndereco) { this.companyEndereco = companyEndereco; }
    public Long getMatrizId() { return matrizId; }
    public void setMatrizId(Long matrizId) { this.matrizId = matrizId; }
    public String getMatrizName() { return matrizName; }
    public void setMatrizName(String matrizName) { this.matrizName = matrizName; }
    public List<String> getPermissions() { return permissions; }
    public void setPermissions(List<String> permissions) { this.permissions = permissions; }
}
