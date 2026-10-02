CREATE TABLE IF NOT EXISTS usuario (
                                       id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       login       VARCHAR(50)  NOT NULL UNIQUE,
    senha_hash  VARCHAR(100) NOT NULL,
    perfil      VARCHAR(20)  NOT NULL,
    CONSTRAINT ck_usuario_perfil CHECK (perfil IN ('ADMINISTRADOR', 'LEITOR'))
    );

CREATE TABLE IF NOT EXISTS aluno (
                                     id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     matricula   VARCHAR(20)  NOT NULL UNIQUE,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    cpf         VARCHAR(11)  NOT NULL UNIQUE,
    telefone    VARCHAR(11)  NOT NULL,
    foto        VARCHAR(255),
    status      VARCHAR(10)  NOT NULL,
    CONSTRAINT ck_aluno_status CHECK (status IN ('ATIVO', 'INATIVO'))
    );