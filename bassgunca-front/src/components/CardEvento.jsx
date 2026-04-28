import React from 'react';

function CardEvento({ evento, usuarioLogado, aoClicarTitulo, aoClicarEstrela }) {
  const meuVulgo = (usuarioLogado?.vulgo || usuarioLogado?.nome)?.toUpperCase();
  const temInteresse = evento.interessados?.includes(meuVulgo);

  return (
    <div 
      className="event-strip" 
      style={{ 
        marginBottom: '15px', 
        padding: '25px', 
        background: '#0a0a0a', 
        borderLeft: '4px solid #ff003c', 
        transition: 'transform 0.2s' 
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(10px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div>
          <h2 
            className="fonte-quadrada" 
            style={{ color: '#fff', cursor: 'pointer', fontSize: '1.8rem', textDecoration: 'none' }}
            onClick={() => aoClicarTitulo(evento)}
          >
            {evento.titulo}
          </h2>
          <p className="fonte-texto" style={{ color: '#aaa', margin: '8px 0' }}>📍 {evento.local}</p>
          
          <span className="fonte-quadrada" style={{ background: '#222', padding: '4px 10px', color: '#ff003c', fontSize: '0.8rem', marginRight: '10px' }}>
            {evento.generos || 'VÁRIOS'}
          </span>
          
          <span className="fonte-quadrada" style={{ background: '#222', padding: '4px 10px', color: '#fff', fontSize: '0.8rem' }}>
            {evento.tipo_evento === 'festival' ? 'FESTIVAL' : 'CLUB'}
          </span>
        </div>
        
        <div style={{ textAlign: 'right' }}>
           <p className="fonte-quadrada" style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
             {new Date(evento.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()}
           </p>
           <button 
              onClick={() => aoClicarEstrela(evento.id)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                color: temInteresse ? '#ff003c' : '#444', 
                fontSize: '2rem' 
              }}
              title="Marcar presença"
           >
             {temInteresse ? '★' : '☆'}
           </button>
        </div>
      </div>
    </div>
  );
}

export default CardEvento;