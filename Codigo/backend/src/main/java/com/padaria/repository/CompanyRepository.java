package com.padaria.repository;

import com.padaria.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCnpj(String cnpj);
    List<Company> findByTipo(String tipo);
    List<Company> findByMatrizId(Long matrizId);
    List<Company> findByAtivo(Boolean ativo);
    boolean existsByMatrizId(Long matrizId);
    List<Company> findByRazaoSocialContainingIgnoreCaseOrNomeContainingIgnoreCaseOrCnpjContainingIgnoreCase(
            String razaoSocial,
            String nome,
            String cnpj
    );
}
