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
        const { 
            titulo, local, data_hora, data_fim, valor, generos, 
            tipo_evento, imagem_url, informacoes, contato_produtor, 
            politica, localizacao_url, link_ingresso, lista_artistas, programacao,
            criado_por // Adicionado aqui
        } = req.body;

        try {
            const query = `
                INSERT INTO eventos (
                    titulo, local, data_hora, data_fim, valor, generos, 
                    tipo_evento, imagem_url, informacoes, contato_produtor, 
                    politica, localizacao_url, link_ingresso, lista_artistas, programacao, criado_por
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `; // Adicionado "criado_por" na string e mais um "?" nos valores
            
            const valores = [
                titulo, local, data_hora, data_fim, valor, generos, 
                tipo_evento, imagem_url, informacoes, contato_produtor, 
                politica, localizacao_url, link_ingresso, lista_artistas, 
                JSON.stringify(programacao || []),
                criado_por // Adicionado aqui nos valores
            ];

            const [resultado] = await pool.query(query, valores);

            res.status(201).json({ 
                mensagem: '🔥 Evento adicionado ao line-up do Bassgunça com sucesso!', 
                id_evento: resultado.insertId 
            });
        } catch (erro) {
            console.error("Erro no MySQL (Criar):", erro);
            res.status(500).json({ erro: 'Erro ao criar evento.' });
        }
    },

    // --- NOVA FUNÇÃO DE ATUALIZAR (EDITAR) ---
    atualizarEvento: async (req, res) => {
        const { id } = req.params;
        const { 
            titulo, local, data_hora, data_fim, valor, generos, 
            tipo_evento, imagem_url, informacoes, contato_produtor, 
            politica, localizacao_url, link_ingresso, lista_artistas, programacao 
        } = req.body;

        try {
            const query = `
                UPDATE eventos SET 
                titulo = ?, local = ?, data_hora = ?, data_fim = ?, valor = ?, generos = ?, 
                tipo_evento = ?, imagem_url = ?, informacoes = ?, contato_produtor = ?, 
                politica = ?, localizacao_url = ?, link_ingresso = ?, lista_artistas = ?, programacao = ?
                WHERE id = ?
            `;

            const valores = [
                titulo, local, data_hora, data_fim, valor, generos, 
                tipo_evento, imagem_url, informacoes, contato_produtor, 
                politica, localizacao_url, link_ingresso, lista_artistas, 
                JSON.stringify(programacao || []), 
                id
            ];

            await pool.query(query, valores);
            res.json({ mensagem: 'Evento atualizado com sucesso!' });
        } catch (erro) {
            console.error("Erro no MySQL (Atualizar):", erro);
            res.status(500).json({ erro: 'Erro ao atualizar evento.' });
        }
    },

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
};

module.exports = eventoController;