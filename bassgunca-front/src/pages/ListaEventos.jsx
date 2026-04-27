import React, { useState } from 'react';

function ListaEventos({ eventos, abrirDetalheEvento, handleToggleInteresse, usuarioLogado }) {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const eventosFiltrados = eventos.filter(evento => {
    const matchesTexto = 
      evento.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (evento.generos && evento.generos.toLowerCase().includes(filtroTexto.toLowerCase())) ||
      (evento.lista_artistas && evento.lista_artistas.toLowerCase().includes(filtroTexto.toLowerCase()));

    const matchesData = filtroData === '' || evento.data_hora.includes(filtroData);
    const matchesTipo = filtroTipo === 'todos' || evento.tipo_evento === filtroTipo;

    return matchesTexto && matchesData && matchesTipo;
  });

  const meuVulgo = (usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase();

  return (
    <section className="eventos-container" style={{ padding: '30px' }}>
      <h1 className="fonte-quadrada" style={{ color: '#ff003c', fontSize: '2.5rem', marginBottom: '20px' }}>
        EXPLORAR EVENTOS
      </h1>

      {/* BARRA DE FILTROS */}
      <div className="filtros-bar" style={{ 
        background: '#0a0a0a', 
        padding: '20px', 
        border: '1px solid #222', 
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <label className="fonte-quadrada" style={{ color: '#555', fontSize: '0.8rem' }}>BUSCA GERAL</label>
          <input 
            type="text" 
            placeholder="Gênero, Artista ou Nome..." 
            className="input-bruto fonte-texto"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)} 
          />
        </div>
        <div>
          <label className="fonte-quadrada" style={{ color: '#555', fontSize: '0.8rem' }}>DATA</label>
          <input 
            type="date" 
            className="input-bruto fonte-texto" 
            style={{ colorScheme: 'dark' }}
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>
        <div>
          <label className="fonte-quadrada" style={{ color: '#555', fontSize: '0.8rem' }}>TIPO</label>
          <select className="input-bruto fonte-texto" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="todos">TODOS OS FORMATOS</option>
            <option value="unico">CLUB / ÚNICO</option>
            <option value="festival">FESTIVAL</option>
          </select>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="event-list">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map(e => (
            <div key={e.id} className="event-strip" style={{ marginBottom: '15px', padding: '20px', background: '#111' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <h2 
                    className="fonte-quadrada" 
                    style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => abrirDetalheEvento(e)}
                  >
                    {e.titulo}
                  </h2>
                  <p className="fonte-texto" style={{ color: '#aaa', margin: '5px 0' }}>📍 {e.local}</p>
                  <span className="fonte-texto" style={{ color: '#ff003c', fontSize: '0.9rem' }}>{e.generos}</span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                   <button 
                      onClick={() => handleToggleInteresse(e.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: e.interessados?.includes(meuVulgo) ? '#ff003c' : '#444', fontSize: '1.8rem' }}
                   >
                     {e.interessados?.includes(meuVulgo) ? '★' : '☆'}
                   </button>
                   <p className="fonte-quadrada" style={{ fontSize: '0.8rem', color: '#666' }}>
                     {new Date(e.data_hora).toLocaleDateString()}
                   </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="fonte-texto" style={{ color: '#444', textAlign: 'center', marginTop: '50px' }}>
            NENHUM ROLÊ ENCONTRADO NA FREQUÊNCIA ATUAL.
          </div>
        )}
      </div>
    </section>
  );
}

export default ListaEventos;