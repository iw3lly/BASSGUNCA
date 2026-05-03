const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); // 👈 Nossa conexão real com o banco

const usuarioRoutes = require('./routes/usuarioRoutes'); 
const eventoRoutes = require('./routes/eventoRoutes');
const feedRoutes = require('./routes/feedRoutes');
const usuarioController = require('./controllers/usuarioController');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas modulares
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/feed', feedRoutes); 

app.post('/api/eventos', (req, res) => {
  const { 
    titulo, local, data_hora, tipo_evento, generos, 
    link_ingresso, lista_artistas, valor_ingresso, dias_festival 
  } = req.body;

  const precoFinal = valor_ingresso ? parseFloat(valor_ingresso) : 0.00;

  const sqlEvento = `
    INSERT INTO eventos 
    (titulo, local, data_hora, tipo_evento, generos, link_ingresso, lista_artistas, valor_ingresso) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const valoresEvento = [
    titulo, local, data_hora, tipo_evento, generos, 
    link_ingresso, lista_artistas, precoFinal
  ];

  pool.query(sqlEvento, valoresEvento, (err, result) => {
    if (err) {
      console.error("Erro ao salvar evento:", err);
      return res.status(500).json({ erro: 'Erro ao salvar o evento principal.' });
    }

    const eventoId = result.insertId; 

    if (tipo_evento === 'festival' && dias_festival && dias_festival.length > 0) {
      
      const sqlDias = `INSERT INTO festival_dias (evento_id, data, horario_inicio) VALUES ?`;
      
      const valoresDias = dias_festival.map(dia => [eventoId, dia.data, dia.horario]);

      pool.query(sqlDias, [valoresDias], (errDias) => {
        if (errDias) {
          console.error("Erro ao salvar o cronograma:", errDias);
          return res.status(500).json({ erro: 'Evento criado, mas falha ao salvar os dias.' });
        }
        
        return res.status(201).json({ message: 'Festival e cronograma gravados com sucesso!', id: eventoId });
      });

    } else {
      return res.status(201).json({ message: 'Evento de dia único gravado com sucesso!', id: eventoId });
    }
  });
});


app.get('/api/eventos/:id/dias', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM festival_dias WHERE evento_id = ? ORDER BY data ASC";
  
  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar dias do festival:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
    res.json({ status: 'ok', mensagem: '🔥 Bem-vindo à API do Bassgunça!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
});

app.put('/api/eventos/:id', (req, res) => {
  const { id } = req.params;
  
  // 1. Agora o back-end "aceita" receber os campos novos
  const { 
    titulo, data_hora, data_fim, valor, local, generos, tipo_evento, 
    imagem_url, informacoes, contato_produtor, politica, 
    localizacao_url, link_ingresso, lista_artistas, programacao 
  } = req.body;

  // 2. Adicionamos os campos na query do SQL
  const query = `
    UPDATE eventos SET 
    titulo = ?, data_hora = ?, data_fim = ?, valor = ?, local = ?, generos = ?, tipo_evento = ?,
    imagem_url = ?, informacoes = ?, contato_produtor = ?, politica = ?, 
    localizacao_url = ?, link_ingresso = ?, lista_artistas = ?, programacao = ?
    WHERE id = ?
  `;

  // 3. Passamos os valores na MESMA ordem das interrogações (?)
  pool.query(query, [
    titulo, data_hora, data_fim, valor, local, generos, tipo_evento, 
    imagem_url, informacoes, contato_produtor, politica, 
    localizacao_url, link_ingresso, lista_artistas, JSON.stringify(programacao), id
  ], (err) => {
    if (err) {
      console.error("ERRO CRÍTICO NO SQL AO SALVAR EVENTO:", err);
      return res.status(500).send(err);
    }
    res.send({ message: "Evento atualizado com sucesso!" });
  });
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, vulgo, data_nascimento, funcao, bio, foto_perfil, redes_sociais } = req.body;

    const query = `
      UPDATE usuarios SET 
      nome = ?, vulgo = ?, data_nascimento = ?, funcoes = ?, bio = ?, foto_perfil = ?, redes_sociais = ?
      WHERE id = ?
    `;

    const valores = [
      nome, 
      vulgo, 
      data_nascimento, 
      funcao, 
      bio, 
      foto_perfil, 
      JSON.stringify(redes_sociais || {}), 
      id
    ];

    // O "await" faz o Node esperar o banco terminar antes de responder
    await pool.query(query, valores);
    
    res.status(200).json({ message: "Perfil atualizado com sucesso!" });

  } catch (err) {
    console.error("Erro CRÍTICO ao salvar perfil no banco:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});