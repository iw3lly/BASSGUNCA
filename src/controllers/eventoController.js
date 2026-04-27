const pool = require('../config/db');

const eventoController = {
    listarEventos: async (req, res) => {
        try {
            const query = `SELECT * FROM eventos ORDER BY data_hora ASC`;
            const [eventos] = await pool.query(query);
            res.json(eventos);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao buscar eventos.' });
        }
    },

    criarEvento: async (req, res) => {
        const { titulo, local, data_hora, generos, link_ingresso, lista_artistas } = req.body;

        try {
            const query = `
                INSERT INTO eventos (titulo, local, data_hora, generos, link_ingresso, lista_artistas) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const valores = [titulo, local, data_hora, generos, link_ingresso, lista_artistas];

            const [resultado] = await pool.query(query, valores);

            res.status(201).json({ 
                mensagem: '🔥 Evento adicionado ao line-up do Bassgunça com sucesso!', 
                id_evento: resultado.insertId 
            });
        } catch (erro) {
            console.error("Erro no MySQL:", erro);
            res.status(500).json({ erro: 'Erro ao criar evento. Verifique se as colunas novas existem no MySQL.' });
        }
    }, // 👈 OLHA A VÍRGULA SALVADORA AQUI!

    // 👇 E A ESTRELINHA AGORA MORA AQUI DENTRO, NO LUGAR CERTO!
    toggleInteresse: async (req, res) => {
        const { id } = req.params;
        const { vulgo } = req.body;

        try {
            const [eventos] = await pool.query('SELECT interessados FROM eventos WHERE id = ?', [id]);
            if (eventos.length === 0) return res.status(404).json({ erro: "Evento não encontrado" });

            let lista = eventos[0].interessados ? eventos[0].interessados.split(',') : [];

            if (lista.includes(vulgo)) {
                lista = lista.filter(v => v !== vulgo); 
            } else {
                lista.push(vulgo); 
            }

            const novaString = lista.join(',');
            await pool.query('UPDATE eventos SET interessados = ? WHERE id = ?', [novaString, id]);

            res.json({ mensagem: "Interesse atualizado com sucesso!" });
        } catch (erro) {
            console.error("Erro no interesse:", erro);
            res.status(500).json({ erro: "Erro ao atualizar interesse." });
        }
    }
}; // 👈 AQUI FECHA O CONTROLLER INTEIRO

module.exports = eventoController; // 👈 E O EXPORT FICA LÁ NO FINAL SOZINHO