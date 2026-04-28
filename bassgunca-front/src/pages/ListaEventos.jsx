import React, { useState } from 'react';
import CardEvento from '../components/CardEvento'; // IMPORTANDO O COMPONENTE NOVO

function ListaEventos({ eventos, abrirDetalheEvento, handleToggleInteresse, usuarioLogado }) {
  const [buscaGeral, setBuscaGeral] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos'); 
  const [filtroPreco, setFiltroPreco] = useState('todos'); 

  const eventosFiltrados = eventos.filter(evento => {
    const termo = buscaGeral.toLowerCase();
    const matchesBusca = 
      evento.titulo.toLowerCase().includes(termo) ||
      (evento.generos && evento.generos.toLowerCase().includes(termo)) ||
      (evento.local && evento.local.toLowerCase().includes(termo)) ||
      (evento.lista_artistas && evento.lista_artistas.toLowerCase().includes(termo));

    const matchesTipo = filtroTipo === 'todos' || evento.tipo_evento === filtroTipo;

    return matchesBusca && matchesTipo;
  });

  return (
    <section className="explorar-container">
      
      {/* 1. HERO SECTION (Com o seu ajuste) */}
      <div className="explorar-hero" style={{ 
        background: 'linear-gradient(180deg, #1a0005 0%, #0a0a0a 100%)', 
        padding: '60px 30px', 
        borderBottom: '1px solid #333',
        textAlign: 'center'
      }}>
        <h1 className="fonte-quadrada" style={{ color: '#fff', fontSize: '3rem', marginBottom: '10px' }}>
          DESCUBRA A <span style={{ color: '#ff003c' }}>CENA</span>
        </h1>
        <p className="fonte-texto" style={{ color: '#aaa', marginBottom: '30px' }}>
          Encontre seu próximo grave.
        </p>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '20px', top: '15px', fontSize: '1.2rem' }}>🔎</span>
          <input 
            type="text" 
            placeholder="Busque por rolê, DJ, gênero ou pico." 
            className="fonte-texto"
            value={buscaGeral}
            onChange={(e) => setBuscaGeral(e.target.value)}
            style={{
              width: '100%',
              padding: '18px 20px 18px 55px',
              fontSize: '1.2rem',
              background: '#000',
              border: '2px solid #333',
              color: '#fff',
              outline: 'none',
              borderRadius: '0', 
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff003c'}
            onBlur={(e) => e.target.style.borderColor = '#333'}
          />
        </div>

        {/* FILTROS RÁPIDOS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
          <button onClick={() => setFiltroTipo('todos')} className="fonte-quadrada" style={{ padding: '8px 20px', background: filtroTipo === 'todos' ? '#ff003c' : 'transparent', border: '1px solid #ff003c', color: '#fff', cursor: 'pointer' }}>TUDO</button>
          <button onClick={() => setFiltroTipo('unico')} className="fonte-quadrada" style={{ padding: '8px 20px', background: filtroTipo === 'unico' ? '#ff003c' : 'transparent', border: '1px solid #ff003c', color: '#fff', cursor: 'pointer' }}>CLUB / ÚNICO</button>
          <button onClick={() => setFiltroTipo('festival')} className="fonte-quadrada" style={{ padding: '8px 20px', background: filtroTipo === 'festival' ? '#ff003c' : 'transparent', border: '1px solid #ff003c', color: '#fff', cursor: 'pointer' }}>FESTIVAIS</button>
          <button onClick={() => setFiltroPreco(filtroPreco === '0800' ? 'todos' : '0800')} className="fonte-quadrada" style={{ padding: '8px 20px', background: filtroPreco === '0800' ? '#fff' : 'transparent', border: '1px solid #fff', color: filtroPreco === '0800' ? '#000' : '#fff', cursor: 'pointer' }}>💸 SÓ 0800</button>
        </div>
      </div>

      {/* 2. RESULTADOS Mapeando o Componente */}
      <div className="event-list" style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="fonte-quadrada" style={{ color: '#555', marginBottom: '20px', fontSize: '1.2rem' }}>
          {eventosFiltrados.length} ROLÊS ENCONTRADOS
        </h2>

        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map(e => (
            <CardEvento 
              key={e.id}
              evento={e}
              usuarioLogado={usuarioLogado}
              aoClicarTitulo={abrirDetalheEvento}
              aoClicarEstrela={handleToggleInteresse}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <h1 style={{ fontSize: '4rem' }}>🕳️</h1>
            <p className="fonte-quadrada" style={{ color: '#666', fontSize: '1.5rem', marginTop: '20px' }}>
              NADA NO RADAR COM ESSE FILTRO.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ListaEventos;