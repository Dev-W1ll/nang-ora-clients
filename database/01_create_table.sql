-- ============================================================
-- 01_create_table.sql  |  Oracle Database
-- Criação da tabela CLIENTES (com sequence e dados de exemplo)
-- ============================================================

CREATE SEQUENCE seq_clientes START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE TABLE clientes (
    id          NUMBER          PRIMARY KEY,
    nome        VARCHAR2(100)   NOT NULL,
    email       VARCHAR2(150)   NOT NULL UNIQUE,
    status      VARCHAR2(10)    DEFAULT 'ATIVO' NOT NULL
                CONSTRAINT ck_clientes_status CHECK (status IN ('ATIVO', 'INATIVO')),
    criado_em   TIMESTAMP       DEFAULT SYSTIMESTAMP NOT NULL
);

-- Dados de exemplo
INSERT INTO clientes (id, nome, email, status)
VALUES (seq_clientes.NEXTVAL, 'Maria Silva', 'maria@exemplo.com', 'ATIVO');

INSERT INTO clientes (id, nome, email, status)
VALUES (seq_clientes.NEXTVAL, 'João Souza', 'joao@exemplo.com', 'INATIVO');

COMMIT;
