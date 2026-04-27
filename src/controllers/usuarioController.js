const pool = require('../config/db');

const usuarioController = {
    listarUsuarios: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios');
            res.status(200).json(rows);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao buscar usuários da cena.' });
        }
    },

    criarUsuario: async (req, res) => {
        const { nome, vulgo, cidade, redes_sociais, email, senha, funcoes } = req.body; 
        
        try {
            const query = 'INSERT INTO usuarios (nome, vulgo, cidade, redes_sociais, email, senha, funcoes) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [resultado] = await pool.query(query, [nome, vulgo, cidade, redes_sociais, email, senha, funcoes]);
            
            res.status(201).json({ 
                id: resultado.insertId, 
                nome, 
                vulgo,
                email, 
                funcoes 
            });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao criar conta.' });
        }
    },

    login: async (req, res) => {
        const { email, senha } = req.body;
        try {
            const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
            const [usuarios] = await pool.query(query, [email, senha]);

            if (usuarios.length > 0) {
                res.status(200).json({ 
                    mensagem: 'Acesso liberado ao VIP!', 
                    usuario: usuarios[0] 
                });
            } else {
                res.status(401).json({ erro: 'Credenciais inválidas. Você não está na lista.' });
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro no servidor ao tentar fazer login.' });
        }
    }
};

module.exports = usuarioController;