-- Patch opcional para bancos que não estiverem com spring.jpa.hibernate.ddl-auto=update
-- Rode apenas se alguma coluna company_id não existir.
-- Se algum comando acusar "Duplicate column", ignore e continue.

ALTER TABLE products ADD COLUMN company_id BIGINT NULL;
ALTER TABLE sales ADD COLUMN company_id BIGINT NULL;
ALTER TABLE waste ADD COLUMN company_id BIGINT NULL;
ALTER TABLE users ADD COLUMN company_id BIGINT NULL;
