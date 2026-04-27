import React from 'react';

function Home({ 
  eventosAtivos, 
  abrirDetalheEvento, 
  handleToggleInteresse, 
  usuarioLogado, 
  handlePostarFeed, 
  novoPost, 
  setNovoPost, 
  feed, 
  abrirPerfilUsuario 
}) {
  return (
    <div className="grid-layout">
      {/* SEÇÃO DE ESTATÍSTICAS */}
      <section className="stats-row">
        <div className="stat-card red">
          <h2 className="fonte-quadrada">{eventosAtivos.length}</h2>
          <span className="fonte-quadrada">EVENTOS ATIVOS</span>
        </div>
        <div className="stat-card purple">
          <h2 className="fonte-quadrada">89</h2> 
          <span className="fonte-quadrada">NA CENA</span>
        </div>
      </section>

      <div className="content-split">
        {/* SEÇÃO DE PRÓXIMOS EVENTOS */}
        <section className="events-section">
          <h2 className="section-title fonte-quadrada">PRÓXIMOS EVENTOS</h2>
          <div className="event-list">
            {eventosAtivos.map(e => (
              <div key={e.id} className="event-strip" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                  <div className="event-info">
                    <span 
                      className="fonte-quadrada" 
                      style={{color: '#ff003c', fontSize: '1.5rem', cursor: 'pointer', textDecoration: 'underline'}}
                      onClick={() => abrirDetalheEvento(e)}
                    >
                      {e.titulo}
                    </span>
                    <small className="fonte-texto" style={{display: 'block'}}>📍 {e.local}</small>
                    {e.generos && <small className="fonte-texto" style={{color: '#666'}}>🎶 {e.generos}</small>}
                  </div>
                  
                  <span className="event-date fonte-quadrada" style={{textAlign: 'right'}}>
                    {e.tipo_evento === 'festival' && e.data_fim
                      ? `${new Date(e.data_hora).toLocaleDateString()} até ${new Date(e.data_fim).toLocaleDateString()}`
                      : new Date(e.data_hora).toLocaleDateString()
                    }
                  </span>
                </div>

                {e.lista_artistas && (
                  <div style={{marginTop: '10px', width: '100%'}}>
                    <p className="fonte-texto" style={{fontSize: '0.85rem', color: '#aaa'}}>
                      <strong style={{color: '#fff'}}>LINE-UP:</strong> {e.lista_artistas}
                    </p>
                  </div>
                )}

                <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <button 
                    onClick={() => handleToggleInteresse(e.id)}
                    style={{
                      background: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '1.5rem',
                      padding: '0',
                      color: e.interessados && e.interessados.includes((usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase()) ? '#ff003c' : '#444'
                    }}
                  >
                    {e.interessados && e.interessados.includes((usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase()) ? '★' : '☆'}
                  </button>
                  <span className="fonte-texto" style={{color: '#aaa', fontSize: '0.85rem'}}>
                    {e.interessados && e.interessados.length > 0 
                      ? `${e.interessados.split(',').length} festeiro(s) com interesse`
                      : 'Seja o primeiro a marcar presença!'}
                  </span>
                </div>

                {e.link_ingresso && (
                  <a href={e.link_ingresso} target="_blank" rel="noreferrer" 
                     className="fonte-quadrada" 
                     style={{marginTop: '15px', color: '#ff003c', textDecoration: 'none', border: '1px solid #ff003c', padding: '5px 15px', fontSize: '0.8rem', display: 'inline-block'}}>
                     INGRESSOS / CORTESIA ➔
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO DO FEED */}
        <section className="feed-section">
          <h2 className="section-title fonte-quadrada">O QUE TÁ ROLANDO?</h2>
          <form className="feed-input" onSubmit={handlePostarFeed}>
            <input type="text" placeholder="Manda a visão..." className="fonte-texto" value={novoPost} onChange={e => setNovoPost(e.target.value)} />
            <button type="submit" className="fonte-quadrada">POSTAR</button>
          </form>
          <div className="feed-list">
            {feed.map(p => (
              <div key={p.id} className="feed-item">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <strong 
                    className="fonte-quadrada" 
                    style={{color: '#ff003c', fontSize: '1.2rem', cursor: 'pointer'}}
                    onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                  >
                    {p.autor_vulgo}
                  </strong> 
                  <span className="fonte-texto" style={{fontSize: '0.75rem', color: '#666'}}>
                    {p.data_criacao ? new Date(p.data_criacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : 'Agora'}
                  </span>
                </div>
                <p className="fonte-texto">{p.texto}</p>
              </div>
            ))}
          </div>
        </section> 
      </div> 
    </div>
  );
}

export default Home;