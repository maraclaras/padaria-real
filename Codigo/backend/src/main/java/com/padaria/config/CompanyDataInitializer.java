package com.padaria.config;

import com.padaria.model.Company;
import com.padaria.repository.CompanyRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CompanyDataInitializer {

    private static final String CNPJ_MATRIZ_PADRAO = "09.644.914/0001-60";

    @Bean
    public ApplicationRunner seedDefaultCompany(CompanyRepository companyRepository) {
        return args -> {
            Company matrizPadrao = companyRepository.findByCnpj(CNPJ_MATRIZ_PADRAO)
                    .orElseGet(() -> {
                        Company company = new Company();
                        company.setRazaoSocial("Padaria Real LTDA");
                        company.setNome("Padaria Real");
                        company.setCnpj(CNPJ_MATRIZ_PADRAO);
                        company.setTipo("MATRIZ");
                        company.setEndereco("R. Mal. Deodoro da Fonseca, 145 - Três Marias, MG, 39205-000");
                        company.setAtivo(true);
                        company.setSistema(true);
                        return companyRepository.save(company);
                    });

            boolean changed = false;

            if (!"MATRIZ".equalsIgnoreCase(matrizPadrao.getTipo())) {
                matrizPadrao.setTipo("MATRIZ");
                matrizPadrao.setMatrizId(null);
                changed = true;
            }

            if (matrizPadrao.getSistema() == null || !matrizPadrao.getSistema()) {
                matrizPadrao.setSistema(true);
                changed = true;
            }

            if (matrizPadrao.getAtivo() == null || !matrizPadrao.getAtivo()) {
                matrizPadrao.setAtivo(true);
                changed = true;
            }

            if (changed) {
                companyRepository.save(matrizPadrao);
            }
        };
    }
}
