import React, { useState } from 'react';

const abaStyle = { background: 'transparent', border: 'none', padding: '15px 5px', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' };

function EventosPerfil({ eventos, usuarioLogado }) {
  const [abaEventos, setAbaEventos] = useState('produtor');

  const meuVulgo = String(usuarioLogado?.vulgo || '').trim().toLowerCase();

  const eventosProdutor = (eventos || []).filter(e => String(e.criado_por || '').toLowerCase() === meuVulgo);
  
  const eventosLineup = (eventos || []).filter(e => {
    const regex = new RegExp(`\\b${meuVulgo}\\b`, 'i');
    return regex.test(e.titulo || '') || regex.test(e.lista_artistas || '');
  });

  const eventosInteressado = (eventos || []).filter(e => String(e.interessados || '').toLowerCase().includes(meuVulgo));

  const filtrados = abaEventos === 'produtor' ? eventosProdutor : abaEventos === 'lineup' ? eventosLineup : eventosInteressado;

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid #1a1a1a' }}>
        {['produtor', 'lineup', 'interessado'].map(aba => (
          <button key={aba} onClick={() => setAbaEventos(aba)} className="fonte-quadrada" style={{ 
            ...abaStyle, 
            borderBottom: abaEventos === aba ? '2px solid #ff003c' : '2px solid transparent',
            color: abaEventos === aba ? '#fff' : '#666'
          }}>
            {aba.toUpperCase()} ({aba === 'produtor' ? eventosProdutor.length : aba === 'lineup' ? eventosLineup.length : eventosInteressado.length})
          </button>
        ))}
      </div>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtrados.length > 0 ? filtrados.map(e => (
          <div key={e.id} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
            <h4 className="fonte-quadrada" style={{ margin: '0 0 10px 0', color: '#ff003c' }}>{e.titulo}</h4>
            <p className="fonte-texto" style={{ color: '#888', fontSize: '0.85rem' }}>📍 {e.local}</p>
          </div>
        )) : (
          <p style={{ color: '#444' }}>Nenhum evento encontrado nesta categoria.</p>
        )}
      </div>
    </div>
  );
}

export default EventosPerfil;