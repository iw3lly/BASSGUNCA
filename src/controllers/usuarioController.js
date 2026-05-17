const pool = require("../config/db");

const usuarioController = {
  listarUsuarios: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM usuarios");
      res.status(200).json(rows);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao buscar usuários da cena." });
    }
  },

  criarUsuario: async (req, res) => {
    const { nome, vulgo, cidade, redes_sociais, email, senha, funcoes } =
      req.body;

    try {
      const query =
        "INSERT INTO usuarios (nome, vulgo, cidade, redes_sociais, email, senha, funcoes) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const [resultado] = await pool.query(query, [
        nome,
        vulgo,
        cidade,
        redes_sociais,
        email,
        senha,
        funcoes,
      ]);

      res.status(201).json({
        id: resultado.insertId,
        nome,
        vulgo,
        email,
        funcoes,
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao criar conta." });
    }
  },

  login: async (req, res) => {
    const { email, senha } = req.body;
    try {
      const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
      const [usuarios] = await pool.query(query, [email, senha]);

      if (usuarios.length > 0) {
        res.status(200).json({
          mensagem: "Acesso liberado ao VIP!",
          usuario: usuarios[0],
        });
      } else {
        res
          .status(401)
          .json({ erro: "Credenciais inválidas. Você não está na lista." });
      }
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro no servidor ao tentar fazer login." });
    }
  },

  // 👇 AQUI ESTÁ A FUNÇÃO NOVA, ARRUMADA PARA O SEU MYSQL 👇
  buscarPorVulgo: async (req, res) => {
    const { vulgo } = req.params;

    try {
      // Buscando no MySQL usando o '?'
      // Troquei 'funcao' por 'funcoes' para bater com o resto do seu código
      const query =
        "SELECT id, nome, vulgo, bio, foto_perfil, funcoes, redes_sociais FROM usuarios WHERE vulgo = ?";
      const [usuarios] = await pool.query(query, [vulgo]);

      if (usuarios.length === 0) {
        return res
          .status(404)
          .json({ erro: "Usuário não encontrado na cena." });
      }

      const usuario = usuarios[0];

      // Se as redes sociais estiverem salvas como texto JSON, converte de volta
      if (
        usuario.redes_sociais &&
        typeof usuario.redes_sociais === "string" &&
        usuario.redes_sociais.startsWith("{")
      ) {
        try {
          usuario.redes_sociais = JSON.parse(usuario.redes_sociais);
        } catch (e) {
          console.error("Erro ao converter redes sociais");
        }
      }

      res.status(200).json(usuario);
    } catch (erro) {
      console.error("Erro ao buscar perfil:", erro);
      res.status(500).json({ erro: "Erro interno no servidor." });
    }
  },
};

module.exports = usuarioController;
