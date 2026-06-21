package com.padaria.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class UserCompanyColumnInitializer {

    private final JdbcTemplate jdbcTemplate;

    public UserCompanyColumnInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void ensureUserCompanyColumnExists() {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'company_id'",
                    Integer.class
            );

            if (count != null && count == 0) {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN company_id BIGINT NULL");
            }
        } catch (Exception e) {
            System.out.println("[WARN] Não foi possível validar/criar users.company_id: " + e.getMessage());
        }
    }
}
