import React, { useState, useEffect } from 'react';

function DetalheEvento({ evento, onVoltar }) {
  const [diasExtras, setDiasExtras] = useState([]);

  useEffect(() => {
    if (evento.tipo_evento === 'festival') {
      fetch(`http://localhost:3000/api/eventos/${evento.id}/dias`)
        .then(res => res.json())
        .then(dados => setDiasExtras(dados))
        .catch(err => console.error("Erro ao buscar cronograma", err));
    }
  }, [evento.id]);

  return (
    <div style={{ 
  padding: '40px', 
  maxWidth: '900px', 
  margin: '0 auto',  
  width: '100%',
  textAlign: 'center' 
}}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
  <button 
    className="fonte-quadrada" 
    onClick={onVoltar} 
    style={{ 
      background: 'transparent', 
      border: '1px solid #222', 
      color: '#aaa', 
      padding: '8px 25px', 
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: '0.3s',
      borderRadius: '2px',
      letterSpacing: '2px'
    }}
    onMouseEnter={(e) => {
      e.target.style.borderColor = '#ff003c';
      e.target.style.color = '#ff003c';
    }}
    onMouseLeave={(e) => {
      e.target.style.borderColor = '#222';
      e.target.style.color = '#aaa';
    }}
  >
    ❮ VOLTAR PARA O RADAR
  </button>
</div>

      <h1 className="fonte-quadrada" style={{ fontSize: '4rem', color: '#fff', marginBottom: '10px' }}>{evento.titulo.toUpperCase()}</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <span className="fonte-quadrada" style={{ background: '#ff003c', padding: '5px 15px', fontSize: '1.2rem' }}>
          {evento.tipo_evento.toUpperCase()}
        </span>
        <span className="fonte-texto" style={{ color: '#aaa', fontSize: '1.2rem' }}>📍 {evento.local}</span>
      </div>

   <div style={{ 
  background: '#0a0a0a', 
  padding: '30px', 
  borderTop: '4px solid #ff003c', // Mudei pra borda no topo pra combinar com o centro
  textAlign: 'left', // 👈 Mantém os dias alinhados à esquerda para leitura rápida
  marginTop: '20px'
}}>
  <h3 className="fonte-quadrada" style={{ color: '#ff003c', marginBottom: '20px', textAlign: 'center' }}>
    🗓️ CRONOGRAMA COMPLETO
  </h3>
        
 
        <div style={{ marginBottom: '15px', padding: '10px', background: '#111' }}>
          <p className="fonte-texto" style={{ margin: 0 }}>
            <strong style={{ color: '#fff' }}>DIA 1:</strong> {new Date(evento.data_hora).toLocaleDateString('pt-BR')} às {new Date(evento.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* DIAS EXTRAS */}
        {diasExtras.map((dia, index) => (
          <div key={dia.id} style={{ marginBottom: '15px', padding: '10px', background: '#111' }}>
            <p className="fonte-texto" style={{ margin: 0 }}>
              <strong style={{ color: '#fff' }}>DIA {index + 2}:</strong> {new Date(dia.data).toLocaleDateString('pt-BR')} às {dia.horario_inicio.substring(0, 5)}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h4 className="fonte-quadrada" style={{ color: '#fff' }}>LINE-UP</h4>
        <p className="fonte-texto" style={{ color: '#aaa', lineHeight: '1.6' }}>{evento.lista_artistas}</p>
      </div>

      {evento.link_ingresso && (
        <a href={evento.link_ingresso} target="_blank" rel="noreferrer" className="btn-destaque fonte-quadrada" style={{ display: 'inline-block', marginTop: '30px', textDecoration: 'none', textAlign: 'center' }}>
          GARANTIR INGRESSO ➔
        </a>
      )}
    </div>
  );
}

export default DetalheEvento;