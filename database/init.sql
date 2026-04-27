CREATE DATABASE IF NOT EXISTS bassgunca;
USE bassgunca;


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_perfil ENUM('publico', 'produtor') DEFAULT 'publico',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Gêneros Musicais
CREATE TABLE generos_musicais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

-- Tabela de Artistas
CREATE TABLE artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bio TEXT,
    links JSON 
);

CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_hora DATETIME NOT NULL,
    local VARCHAR(255) NOT NULL,
    id_produtor INT,
    status ENUM('rascunho', 'publicado', 'cancelado') DEFAULT 'rascunho',
    FOREIGN KEY (id_produtor) REFERENCES usuarios(id) ON DELETE CASCADE
);



CREATE TABLE artistas_generos (
    id_artista INT,
    id_genero INT,
    PRIMARY KEY (id_artista, id_genero),
    FOREIGN KEY (id_artista) REFERENCES artistas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES generos_musicais(id) ON DELETE CASCADE
);

CREATE TABLE line_ups (
    id_evento INT,
    id_artista INT,
    horario_apresentacao TIME,
    PRIMARY KEY (id_evento, id_artista),
    FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_artista) REFERENCES artistas(id) ON DELETE CASCADE
);

CREATE TABLE preferencias_usuarios (
    id_usuario INT,
    id_genero INT,
    peso_afinidade FLOAT DEFAULT 1.0,
    PRIMARY KEY (id_usuario, id_genero),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES generos_musicais(id) ON DELETE CASCADE
);

CREATE TABLE feedbacks_eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_evento INT,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    sugestao_artista VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_evento) REFERENCES eventos(id)
);