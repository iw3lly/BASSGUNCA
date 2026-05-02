import React, { useState } from 'react';

const ListaEventos = ({ eventos, abrirDetalheEvento, handleToggleInteresse, usuarioLogado }) => {
  // Estados para os filtros
  const [abaRapida, setAbaRapida] = useState('tudo'); // 'tudo', 'hoje', 'populares'
  const [filtroValor, setFiltroValor] = useState('todos'); // 'todos', 'gratis', '50', '100'
  const [dataEspecifica, setDataEspecifica] = useState('');

  // 1. PREPARAÇÃO DOS DADOS (SIMULANDO VALORES CASO O BANCO NÃO TENHA)
  const eventosPreparados = (eventos || []).map(e => {
    // Se não existir campo 'valor', simulamos baseado no ID para não quebrar a apresentação
    const valorSimulado = e.id % 3 === 0 ? 0 : (e.id % 2 === 0 ? 40 : 120);
    const valorReal = e.valor !== undefined && e.valor !== null && e.valor !== '' ? Number(e.valor) : valorSimulado;
    
    // Contagem de interessados para o filtro "Populares"
    const qtdInteressados = e.interessados ? e.interessados.split(',').filter(i => i.trim() !== '').length : 0;

    return { ...e, valorExibicao: valorReal, qtdInteressados };
  });

  // 2. LÓGICA DE FILTRAGEM
  const hoje = new Date();
  const hojeString = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

  let eventosFiltrados = eventosPreparados.filter(e => {
    if (!e.data_hora) return false;
    
    const dataEvento = new Date(e.data_hora);
    const dataEventoString = `${dataEvento.getFullYear()}-${String(dataEvento.getMonth() + 1).padStart(2, '0')}-${String(dataEvento.getDate()).padStart(2, '0')}`;

    // Filtro de Aba "O QUE FAZER HOJE"
    if (abaRapida === 'hoje' && dataEventoString !== hojeString) return false;

    // Filtro de Data Específica do Input
    if (dataEspecifica && dataEventoString !== dataEspecifica) return false;

    // Filtro de Valor
    if (filtroValor === 'gratis' && e.valorExibicao > 0) return false;
    if (filtroValor === '50' && e.valorExibicao > 50) return false;
    if (filtroValor === '100' && e.valorExibicao > 100) return false;

    return true;
  });

  // 3. LÓGICA DE ORDENAÇÃO
  if (abaRapida === 'populares') {
    // Ordena do maior número de interessados para o menor
    eventosFiltrados.sort((a, b) => b.qtdInteressados - a.qtdInteressados);
  } else {
    // Padrão: Mais próximos primeiro
    eventosFiltrados.sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
  }

  // Verifica se o usuário curtiu
  const meuVulgo = String(usuarioLogado?.vulgo || usuarioLogado?.nome || '').trim().toLowerCase();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '85vh', paddingBottom: '100px' }}>
      
      {/* HEADER DA AGENDA */}
      <div style={{ marginBottom: '30px' }}>
        <h1 className="fonte-quadrada" style={{ fontSize: '3.5rem', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '-2px' }}>
          AGENDA <span style={{ color: '#ff003c' }}>//</span> BASS
        </h1>
        <p className="fonte-texto" style={{ color: '#888', marginTop: '5px', fontSize: '1.1rem' }}>
          Explore a cena. Filtre seu rolê.
        </p>
      </div>

      {/* BARRA DE FILTROS AVANÇADOS */}
      <div style={{ background: '#050505', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
        
        {/* ABAS RÁPIDAS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: '1 1 300px' }}>
          <button onClick={() => setAbaRapida('tudo')} className={`btn-aba ${abaRapida === 'tudo' ? 'ativo' : ''}`}>TUDO</button>
          <button onClick={() => setAbaRapida('hoje')} className={`btn-aba ${abaRapida === 'hoje' ? 'ativo' : ''}`}>🔥 HOJE</button>
          <button onClick={() => setAbaRapida('populares')} className={`btn-aba ${abaRapida === 'populares' ? 'ativo' : ''}`}>💥 EM ALTA</button>
        </div>

        {/* FILTRO DE VALOR */}
        <div style={{ flex: '1 1 200px' }}>
          <label className="fonte-texto" style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>FAIXA DE PREÇO</label>
          <select 
            value={filtroValor} 
            onChange={(e) => setFiltroValor(e.target.value)}
            className="input-filtro"
          >
            <option value="todos">Qualquer Valor</option>
            <option value="gratis">0800 (Grátis)</option>
            <option value="50">Até R$ 50,00</option>
            <option value="100">Até R$ 100,00</option>
          </select>
        </div>

        {/* FILTRO DE DATA */}
        <div style={{ flex: '1 1 200px' }}>
          <label className="fonte-texto" style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>DATA ESPECÍFICA</label>
          <input 
            type="date" 
            value={dataEspecifica} 
            onChange={(e) => setDataEspecifica(e.target.value)}
            className="input-filtro"
          />
        </div>

        {/* BOTÃO LIMPAR FILTROS */}
        {(filtroValor !== 'todos' || dataEspecifica !== '' || abaRapida !== 'tudo') && (
          <button 
            onClick={() => { setFiltroValor('todos'); setDataEspecifica(''); setAbaRapida('tudo'); }}
            style={{ background: 'transparent', border: '1px solid #ff003c', color: '#ff003c', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
          >
            X LIMPAR
          </button>
        )}
      </div>

      {/* GRID DE RESULTADOS */}
      {eventosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#0a0a0a', border: '1px dashed #333', borderRadius: '12px' }}>
          <h2 className="fonte-quadrada" style={{ color: '#555', fontSize: '2rem' }}>NENHUM EVENTO DETECTADO</h2>
          <p className="fonte-texto" style={{ color: '#888' }}>Tente ajustar os filtros ou limpar sua busca.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {eventosFiltrados.map(evento => {
            const dataObjeto = new Date(evento.data_hora);
            const jaPassou = dataObjeto < hoje && abaRapida !== 'hoje';
            const taInteressado = evento.interessados ? evento.interessados.toLowerCase().includes(meuVulgo) : false;

            return (
              <div key={evento.id} className="card-evento" style={{ opacity: jaPassou ? 0.5 : 1 }}>
                
                {/* TOPO DO CARD: VALOR E DATA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' }}>
                  <div style={{ background: evento.valorExibicao === 0 ? '#00ff00' : '#111', color: evento.valorExibicao === 0 ? '#000' : '#00ff00', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {evento.valorExibicao === 0 ? '0800 LIVRE' : `R$ ${evento.valorExibicao.toFixed(2)}`}
                  </div>
                  <div className="fonte-quadrada" style={{ color: '#ff003c', fontSize: '1.2rem' }}>
                    {String(dataObjeto.getDate()).padStart(2, '0')}/{String(dataObjeto.getMonth() + 1).padStart(2, '0')}
                  </div>
                </div>

                <h3 className="fonte-quadrada" style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#fff', textTransform: 'uppercase' }}>
                  {evento.titulo}
                </h3>
                
                <p className="fonte-texto" style={{ margin: '0 0 8px 0', color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📍 {evento.local || 'Local a definir'}
                </p>
                <p className="fonte-texto" style={{ margin: '0 0 20px 0', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  👥 {evento.qtdInteressados} confirmados na cena
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button 
                    onClick={() => abrirDetalheEvento(evento)} 
                    style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', transition: '0.2s' }}
                    onMouseOver={e => e.target.style.background = '#333'}
                    onMouseOut={e => e.target.style.background = '#1a1a1a'}
                  >
                    + INFO
                  </button>
                  <button 
                    onClick={() => handleToggleInteresse(evento.id)} 
                    style={{ background: taInteressado ? '#ff003c' : 'transparent', color: taInteressado ? '#fff' : '#ff003c', border: '1px solid #ff003c', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s', fontSize: '1.2rem' }}
                    title={taInteressado ? "Remover Interesse" : "Marcar Interesse"}
                  >
                    {taInteressado ? '🔥' : '🤍'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ESTILOS INTERNOS */}
      <style>{`
        .btn-aba { background: transparent; color: #666; border: 1px solid #333; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-family: 'Space Mono', monospace; font-weight: bold; transition: all 0.2s; font-size: 0.9rem; }
        .btn-aba:hover { border-color: #ff003c; color: #fff; }
        .btn-aba.ativo { background: #ff003c; color: #fff; border-color: #ff003c; box-shadow: 0 0 10px rgba(255, 0, 60, 0.3); }

        .input-filtro { background: #000; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 6px; outline: none; font-family: monospace; font-size: 0.9rem; width: 100%; box-sizing: border-box; transition: 0.3s; }
        .input-filtro:focus { border-color: #ff003c; }

        .card-evento { background: #050505; border: 1px solid #1a1a1a; padding: 25px; border-radius: 12px; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s; position: relative; overflow: hidden; }
        .card-evento:hover { transform: translateY(-5px); border-color: #ff003c; }
        .card-evento::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #ff003c; opacity: 0; transition: 0.3s; }
        .card-evento:hover::before { opacity: 1; }
      `}</style>
    </div>
  );
};

export default ListaEventos;