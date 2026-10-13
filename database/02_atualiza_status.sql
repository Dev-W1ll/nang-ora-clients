-- ============================================================
-- 02_atualiza_status.sql  |  Oracle PL/SQL
-- Procedure que altera o status de um cliente, com validação
-- e tratamento de exceções, e um bloco anônimo de exemplo.
-- ============================================================

SET SERVEROUTPUT ON;

CREATE OR REPLACE PROCEDURE atualiza_status_cliente (
    p_id     IN clientes.id%TYPE,
    p_status IN clientes.status%TYPE
) IS
    v_status_atual clientes.status%TYPE;
BEGIN
    IF p_status NOT IN ('ATIVO', 'INATIVO') THEN
        RAISE_APPLICATION_ERROR(-20001, 'Status inválido: ' || p_status);
    END IF;

    -- Lança NO_DATA_FOUND se o cliente não existir
    SELECT status INTO v_status_atual
      FROM clientes
     WHERE id = p_id;

    IF v_status_atual = p_status THEN
        DBMS_OUTPUT.PUT_LINE('Cliente ' || p_id || ' já está ' || p_status || '. Nada a fazer.');
        RETURN;
    END IF;

    UPDATE clientes
       SET status = p_status
     WHERE id = p_id;

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Cliente ' || p_id || ': ' || v_status_atual || ' -> ' || p_status);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Cliente ' || p_id || ' não encontrado.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END atualiza_status_cliente;
/

-- Bloco anônimo de exemplo: inativa o cliente de id 1
BEGIN
    atualiza_status_cliente(1, 'INATIVO');
END;
/
