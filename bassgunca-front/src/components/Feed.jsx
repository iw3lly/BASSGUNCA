import React from 'react';

function Feed({ feed, novoPost, setNovoPost, handlePostarFeed, abrirPerfilUsuario }) {
  return (
    <div style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      
      <div style={{ marginBottom: '40px', marginTop: '20px' }}>
        <h2 className="fonte-quadrada" style={{ fontSize: '2.5rem', color: '#fff', margin: 0 }}>
          🗣️ FEED DA CENA
        </h2>
        <p className="fonte-texto" style={{ color: '#aaa', marginTop: '10px' }}>
          Onde é o after? Quem tem VIP? Manda a visão pra comunidade.
        </p>
      </div>

      
      <form 
        className="feed-input" 
        onSubmit={handlePostarFeed} 
        style={{ 
          marginBottom: '50px', 
          display: 'flex', 
          gap: '15px',
          background: '#0a0a0a',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #1a1a1a'
        }}
      >
        <input 
          type="text" 
          placeholder="Escreve aí..." 
          className="fonte-texto" 
          value={novoPost} 
          onChange={e => setNovoPost(e.target.value)} 
          style={{ 
            flex: 1,
            padding: '15px 20px', 
            fontSize: '1.1rem', 
            background: '#050505', 
            border: '1px solid #333',
            color: '#fff',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          className="fonte-quadrada" 
          style={{ 
            padding: '0 30px',
            background: '#ff003c',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#cc0030'}
          onMouseOut={(e) => e.target.style.background = '#ff003c'}
        >
          POSTAR
        </button>
      </form>

      <div className="feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {feed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', border: '1px dashed #333', borderRadius: '12px' }}>
             <p className="fonte-texto" style={{ color: '#666', fontSize: '1.2rem' }}>
               A timeline tá vazia. Seja o primeiro a puxar o bonde!
             </p>
          </div>
        ) : (
          feed.map(p => (
            <div 
              key={p.id} 
              className="feed-item" 
              style={{ 
                background: '#050505', 
                padding: '30px', 
                borderRadius: '12px',
                border: '1px solid #111',
                borderLeft: '4px solid #ff003c',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <strong 
                  className="fonte-quadrada" 
                  style={{ color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}
                  onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                >
                  @{p.autor_vulgo}
                </strong> 
                <span className="fonte-texto" style={{ fontSize: '0.85rem', color: '#666' }}>
  {p.data_criacao 
    ? `${new Date(p.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${new Date(p.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}` 
    : 'Agora'}
</span>
              </div>
              <p className="fonte-texto" style={{ fontSize: '1.15rem', lineHeight: '1.6', color: '#ddd', margin: 0 }}>
                {p.texto}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;