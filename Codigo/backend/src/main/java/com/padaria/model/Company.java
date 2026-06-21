package com.padaria.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Razão social é obrigatória")
    @Column(name = "razao_social", nullable = false, length = 150)
    private String razaoSocial;

    @NotBlank(message = "Nome é obrigatório")
    @JsonAlias({"nomeFantasia"})
    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @NotBlank(message = "CNPJ é obrigatório")
    @Column(nullable = false, unique = true, length = 20)
    private String cnpj;

    @NotBlank(message = "Tipo da unidade é obrigatório")
    @Column(nullable = false, length = 20)
    private String tipo; // MATRIZ ou FILIAL

    @Column(name = "matriz_id")
    private Long matrizId;

    @Column(length = 255)
    private String endereco;

    private Boolean ativo;

    @Column(name = "sistema")
    private Boolean sistema;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @Column(name = "updated_at")
    private Long updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
        updatedAt = System.currentTimeMillis();
        normalizeDefaults();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
        normalizeDefaults();
    }

    private void normalizeDefaults() {
        if (ativo == null) {
            ativo = true;
        }
        if (sistema == null) {
            sistema = false;
        }
        if (tipo != null) {
            tipo = tipo.trim().toUpperCase();
        }
        if ("MATRIZ".equals(tipo)) {
            matrizId = null;
        }
    }

    public Long getId() { return id; }
    public String getRazaoSocial() { return razaoSocial; }
    public String getNome() { return nome; }
    public String getCnpj() { return cnpj; }
    public String getTipo() { return tipo; }
    public Long getMatrizId() { return matrizId; }
    public String getEndereco() { return endereco; }
    public Boolean getAtivo() { return ativo; }
    public Boolean getSistema() { return sistema; }
    public Long getCreatedAt() { return createdAt; }
    public Long getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setMatrizId(Long matrizId) { this.matrizId = matrizId; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public void setSistema(Boolean sistema) { this.sistema = sistema; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Long updatedAt) { this.updatedAt = updatedAt; }
}
