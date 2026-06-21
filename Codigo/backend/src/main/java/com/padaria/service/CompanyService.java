package com.padaria.service;

import com.padaria.model.Company;
import com.padaria.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public Optional<Company> getCompanyByCnpj(String cnpj) {
        return companyRepository.findByCnpj(cnpj);
    }

    public List<Company> getCompaniesByTipo(String tipo) {
        return companyRepository.findByTipo(normalizeTipo(tipo));
    }

    public List<Company> getBranchesByMatriz(Long matrizId) {
        return companyRepository.findByMatrizId(matrizId);
    }

    public List<Company> searchCompanies(String term) {
        return companyRepository.findByRazaoSocialContainingIgnoreCaseOrNomeContainingIgnoreCaseOrCnpjContainingIgnoreCase(
                term,
                term,
                term
        );
    }

    public Company createCompany(Company company) {
        prepareCompany(company);
        company.setSistema(false);
        validateCompany(company, null);
        return companyRepository.save(company);
    }

    public Company updateCompany(Long id, Company companyDetails) {
        Optional<Company> company = companyRepository.findById(id);

        if (company.isPresent()) {
            Company c = company.get();
            boolean isDefaultCompany = Boolean.TRUE.equals(c.getSistema());

            if (companyDetails.getRazaoSocial() != null) {
                c.setRazaoSocial(companyDetails.getRazaoSocial());
            }
            if (companyDetails.getNome() != null) {
                c.setNome(companyDetails.getNome());
            }
            if (companyDetails.getCnpj() != null && !isDefaultCompany) {
                c.setCnpj(companyDetails.getCnpj());
            }
            if (companyDetails.getTipo() != null && !isDefaultCompany) {
                c.setTipo(companyDetails.getTipo());
            }
            if (!isDefaultCompany) {
                c.setMatrizId(companyDetails.getMatrizId());
            }
            if (companyDetails.getEndereco() != null) {
                c.setEndereco(companyDetails.getEndereco());
            }
            if (companyDetails.getAtivo() != null && !isDefaultCompany) {
                c.setAtivo(companyDetails.getAtivo());
            }

            if (isDefaultCompany) {
                c.setTipo("MATRIZ");
                c.setMatrizId(null);
                c.setAtivo(true);
                c.setSistema(true);
            }

            prepareCompany(c);
            validateCompany(c, id);
            return companyRepository.save(c);
        }

        return null;
    }

    public boolean deleteCompany(Long id) {
        Optional<Company> company = companyRepository.findById(id);

        if (company.isEmpty()) {
            return false;
        }

        if (Boolean.TRUE.equals(company.get().getSistema())) {
            throw new IllegalArgumentException("A matriz padrão do sistema não pode ser excluída.");
        }

        if (companyRepository.existsByMatrizId(id)) {
            throw new IllegalArgumentException("Não é possível excluir uma matriz que possui filiais vinculadas.");
        }

        companyRepository.deleteById(id);
        return true;
    }

    private void prepareCompany(Company company) {
        if (company.getRazaoSocial() != null) {
            company.setRazaoSocial(company.getRazaoSocial().trim());
        }
        if (company.getNome() != null) {
            company.setNome(company.getNome().trim());
        }
        if (company.getCnpj() != null) {
            company.setCnpj(company.getCnpj().trim());
        }
        if (company.getEndereco() != null) {
            company.setEndereco(company.getEndereco().trim());
        }

        company.setTipo(normalizeTipo(company.getTipo()));

        if (company.getAtivo() == null) {
            company.setAtivo(true);
        }
        if (company.getSistema() == null) {
            company.setSistema(false);
        }

        if ("MATRIZ".equals(company.getTipo())) {
            company.setMatrizId(null);
        }
    }

    private void validateCompany(Company company, Long currentId) {
        if (isBlank(company.getRazaoSocial())) {
            throw new IllegalArgumentException("Informe a razão social da empresa.");
        }
        if (isBlank(company.getNome())) {
            throw new IllegalArgumentException("Informe o nome da empresa.");
        }
        if (isBlank(company.getCnpj())) {
            throw new IllegalArgumentException("Informe o CNPJ da empresa.");
        }
        if (!"MATRIZ".equals(company.getTipo()) && !"FILIAL".equals(company.getTipo())) {
            throw new IllegalArgumentException("Tipo da unidade deve ser MATRIZ ou FILIAL.");
        }

        Optional<Company> companyWithSameCnpj = companyRepository.findByCnpj(company.getCnpj());
        if (companyWithSameCnpj.isPresent() && !companyWithSameCnpj.get().getId().equals(currentId)) {
            throw new IllegalArgumentException("Já existe uma empresa ou filial cadastrada com este CNPJ.");
        }

        if ("FILIAL".equals(company.getTipo())) {
            if (company.getMatrizId() == null) {
                throw new IllegalArgumentException("Selecione a matriz vinculada a esta filial.");
            }

            Optional<Company> matriz = companyRepository.findById(company.getMatrizId());
            if (matriz.isEmpty()) {
                throw new IllegalArgumentException("A matriz informada não foi encontrada.");
            }
            if (!"MATRIZ".equals(normalizeTipo(matriz.get().getTipo()))) {
                throw new IllegalArgumentException("A unidade vinculada precisa ser do tipo MATRIZ.");
            }
            if (currentId != null && company.getMatrizId().equals(currentId)) {
                throw new IllegalArgumentException("Uma filial não pode ser vinculada a ela mesma.");
            }
        }
    }

    private String normalizeTipo(String tipo) {
        if (tipo == null) {
            return null;
        }
        return tipo.trim().toUpperCase();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
