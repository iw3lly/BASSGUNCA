import React from 'react';
import CardEvento from '../components/CardEvento';

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

  // 1. LÓGICA DAS CATEGORIAS (Estilo Shotgun)
  const eventosPopulares = [...eventosAtivos].sort((a, b) => {
    const qtdA = a.interessados && a.interessados.trim() !== '' ? a.interessados.split(',').length : 0;
    const qtdB = b.interessados && b.interessados.trim() !== '' ? b.interessados.split(',').length : 0;
    return qtdB - qtdA; 
  }).slice(0, 5); // Pega os 5 mais hypados

  const festivais = eventosAtivos.filter(e => e.tipo_evento === 'festival');

  // Estilo para a rolagem horizontal invisível (limpo e moderno)
  const carrosselStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: '20px',
    paddingBottom: '20px',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none', // Oculta a barra no Firefox
    msOverflowStyle: 'none', // Oculta no IE/Edge
  };

  return (
    <div style={{ padding: '0 20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. SEÇÃO: DESTAQUE (EM ALTA) */}
      <section style={{ marginTop: '40px', marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <h2 className="fonte-quadrada" style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>
            🔥 EM ALTA
          </h2>
          <span className="fonte-texto" style={{ color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' }}>VER TUDO ➔</span>
        </div>
        
        {/* Carrossel Horizontal */}
        <div className="hide-scroll" style={carrosselStyle}>
          {eventosPopulares.map(e => (
            <div key={`pop-${e.id}`} style={{ flex: '0 0 450px', scrollSnapAlign: 'start' }}>
              <CardEvento 
                evento={e}
                usuarioLogado={usuarioLogado}
                aoClicarTitulo={abrirDetalheEvento}
                aoClicarEstrela={handleToggleInteresse}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. SEÇÃO: FESTIVAIS */}
      {festivais.length > 0 && (
        <section style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <h2 className="fonte-quadrada" style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>
              🎪 FESTIVAIS DA CENA
            </h2>
          </div>
          
          <div className="hide-scroll" style={carrosselStyle}>
            {festivais.map(e => (
              <div key={`fest-${e.id}`} style={{ flex: '0 0 450px', scrollSnapAlign: 'start' }}>
                <CardEvento 
                  evento={e}
                  usuarioLogado={usuarioLogado}
                  aoClicarTitulo={abrirDetalheEvento}
                  aoClicarEstrela={handleToggleInteresse}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. SEÇÃO: A AGENDA (Todos os próximos) */}
      <section style={{ marginBottom: '50px' }}>
        <h2 className="fonte-quadrada" style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px' }}>
          🗓️ PRÓXIMOS ROLÊS
        </h2>
        {/* Aqui deixamos em Grid para preencher a tela */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' }}>
          {eventosAtivos.slice(0, 8).map(e => (
            <CardEvento 
              key={e.id}
              evento={e}
              usuarioLogado={usuarioLogado}
              aoClicarTitulo={abrirDetalheEvento}
              aoClicarEstrela={handleToggleInteresse}
            />
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO DA COMUNIDADE (O FEED FOI PRO FINAL, ESTILO FORUM) */}
      <section style={{ marginTop: '60px', borderTop: '1px solid #222', paddingTop: '40px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="fonte-quadrada" style={{ fontSize: '2rem', color: '#ff003c', textAlign: 'center', marginBottom: '30px' }}>
            🗣️ BASSGUNÇA COMMUNITY
          </h2>
          
          <form className="feed-input" onSubmit={handlePostarFeed} style={{ marginBottom: '40px' }}>
            <input 
              type="text" 
              placeholder="Onde é o after? Manda a visão..." 
              className="fonte-texto" 
              value={novoPost} 
              onChange={e => setNovoPost(e.target.value)} 
              style={{ padding: '20px', fontSize: '1.1rem', background: '#050505', border: '1px solid #333' }}
            />
            <button type="submit" className="fonte-quadrada" style={{ padding: '0 30px' }}>POSTAR</button>
          </form>

          <div className="feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {feed.slice(0, 10).map(p => (
              <div key={p.id} className="feed-item" style={{ background: '#0a0a0a', padding: '25px', borderLeft: '4px solid #333' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px'}}>
                  <strong 
                    className="fonte-quadrada" 
                    style={{color: '#ff003c', fontSize: '1.2rem', cursor: 'pointer'}}
                    onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                  >
                    @{p.autor_vulgo}
                  </strong> 
                  <span className="fonte-texto" style={{fontSize: '0.85rem', color: '#666'}}>
                    {p.data_criacao ? new Date(p.data_criacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : 'Agora'}
                  </span>
                </div>
                <p className="fonte-texto" style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#ddd' }}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;