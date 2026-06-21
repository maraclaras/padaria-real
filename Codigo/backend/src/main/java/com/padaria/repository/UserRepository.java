package com.padaria.repository;

import com.padaria.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();

        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setName(rs.getString("name"));
        user.setRole(rs.getString("role"));

        Object companyIdValue = rs.getObject("company_id");
        user.setCompanyId(companyIdValue == null ? null : rs.getLong("company_id"));

        user.setActive(rs.getBoolean("active"));
        user.setCreatedAt(rs.getLong("created_at"));
        user.setUpdatedAt(rs.getLong("updated_at"));

        return user;
    };

    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY id DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, id);

        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, username);

        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    public User save(User user) {
        user.setCreatedAt(System.currentTimeMillis());
        user.setUpdatedAt(System.currentTimeMillis());

        String sql = "INSERT INTO users " +
                "(username, password, name, role, company_id, active, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getName());
            ps.setString(4, user.getRole());

            if (user.getCompanyId() == null) {
                ps.setObject(5, null);
            } else {
                ps.setLong(5, user.getCompanyId());
            }

            ps.setBoolean(6, Boolean.TRUE.equals(user.getActive()));
            ps.setLong(7, user.getCreatedAt());
            ps.setLong(8, user.getUpdatedAt());

            return ps;
        }, keyHolder);

        user.setId(keyHolder.getKey().longValue());

        return user;
    }

    public User update(User user) {
        user.setUpdatedAt(System.currentTimeMillis());

        String sql = "UPDATE users " +
                "SET username = ?, password = ?, name = ?, role = ?, company_id = ?, active = ?, updated_at = ? " +
                "WHERE id = ?";

        jdbcTemplate.update(
                sql,
                user.getUsername(),
                user.getPassword(),
                user.getName(),
                user.getRole(),
                user.getCompanyId(),
                Boolean.TRUE.equals(user.getActive()),
                user.getUpdatedAt(),
                user.getId()
        );

        return user;
    }

    public int updatePasswordById(Long id, String password, Long updatedAt) {
        String sql = "UPDATE users SET password = ?, updated_at = ? WHERE id = ?";
        return jdbcTemplate.update(sql, password, updatedAt, id);
    }

    public int updateProfileById(Long id, String name, String username, Long updatedAt) {
        String sql = "UPDATE users SET name = ?, username = ?, updated_at = ? WHERE id = ?";
        return jdbcTemplate.update(sql, name, username, updatedAt, id);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}