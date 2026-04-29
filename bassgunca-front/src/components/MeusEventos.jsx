import React, { useState } from 'react';

function MeusEventos({ eventos, usuarioLogado, setEventos }) {
    console.log("Utilizador Logado:", usuarioLogado);
  console.log("Lista de Eventos:", eventos);
  const [editando, setEditando] = useState(null);

 const meusEventos = (eventos || []).filter(e => {
    const criador = String(e.criado_por || '').trim().toLowerCase();
    const logado = String(usuarioLogado?.vulgo || usuarioLogado?.nome || '').trim().toLowerCase();
    return criador === logado;
  });

const handleSalvar = async (e) => {
  e.preventDefault();
  
  
  const dadosParaSalvar = {
    ...editando,
    criado_por: usuarioLogado.vulgo 
  };

  try {
    const response = await fetch(`http://localhost:3000/api/eventos/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosParaSalvar) 
    });

    if (response.ok) {
      alert("Evento atualizado!");
      setEditando(null);
    }
  } catch (err) {
    console.error(err);
  }
};

  if (editando) {
    return (
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => setEditando(null)} className="fonte-quadrada" style={{ color: '#ff003c', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← VOLTAR</button>
        <h2 className="fonte-quadrada" style={{ color: '#fff', fontSize: '2rem' }}>EDITAR: {editando.titulo}</h2>
        
        <form onSubmit={handleSalvar} style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label className="fonte-texto" style={{ color: '#666' }}>Nome do Evento
              <input type="text" value={editando.titulo} onChange={e => setEditando({...editando, titulo: e.target.value})} style={inputStyle} />
            </label>
            <label className="fonte-texto" style={{ color: '#666' }}>Flyer (URL da Imagem)
              <input type="text" value={editando.imagem_url || ''} onChange={e => setEditando({...editando, imagem_url: e.target.value})} style={inputStyle} />
            </label>
          </div>

          <label className="fonte-texto" style={{ color: '#666' }}>Descrição / Informações
            <textarea value={editando.informacoes || ''} onChange={e => setEditando({...editando, informacoes: e.target.value})} style={{...inputStyle, height: '100px'}} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label className="fonte-texto" style={{ color: '#666' }}>Local (Nome do pico)
              <input type="text" value={editando.local} onChange={e => setEditando({...editando, local: e.target.value})} style={inputStyle} />
            </label>
            <label className="fonte-texto" style={{ color: '#666' }}>Localização (Link Google Maps)
              <input type="text" value={editando.localizacao_url || ''} onChange={e => setEditando({...editando, localizacao_url: e.target.value})} style={inputStyle} />
            </label>
          </div>

          <div style={{ background: '#111', padding: '20px', borderRadius: '8px' }}>
            <h3 className="fonte-quadrada" style={{ color: '#fff', marginBottom: '15px' }}>PROGRAMAÇÃO & LINEUP</h3>
            <p className="fonte-texto" style={{ color: '#666', fontSize: '0.8rem' }}>Ex: Dia 1: Techno (Line: DJ A, DJ B) | Dia 2: Bass (Line: DJ C)</p>
            <textarea 
              value={typeof editando.programacao === 'string' ? editando.programacao : JSON.stringify(editando.programacao)} 
              onChange={e => setEditando({...editando, programacao: e.target.value})} 
              style={{...inputStyle, height: '80px', fontFamily: 'monospace'}} 
              placeholder='[{"data": "2026-05-10", "lineup": "DJ X, DJ Y"}]'
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label className="fonte-texto" style={{ color: '#666' }}>Contato do Produtor
              <input type="text" value={editando.contato_produtor || ''} onChange={e => setEditando({...editando, contato_produtor: e.target.value})} style={inputStyle} />
            </label>
            <label className="fonte-texto" style={{ color: '#666' }}>Política do Evento
              <input type="text" value={editando.politica || ''} onChange={e => setEditando({...editando, politica: e.target.value})} style={inputStyle} />
            </label>
          </div>

          <button type="submit" className="btn-destaque fonte-quadrada" style={{ padding: '20px', fontSize: '1.2rem' }}>SALVAR ALTERAÇÕES</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <h2 className="fonte-quadrada" style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '30px' }}>MEUS EVENTOS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {meusEventos.map(e => (
          <div key={e.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '8px' }}>
            <h3 className="fonte-quadrada" style={{ color: '#fff', margin: '0 0 10px 0' }}>{e.titulo}</h3>
            <p className="fonte-texto" style={{ color: '#666' }}>📍 {e.local}</p>
            <button 
              onClick={() => setEditando(e)}
              className="fonte-quadrada" 
              style={{ marginTop: '20px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', width: '100%' }}
            >
              EDITAR ROLÊ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#050505',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '4px',
  marginTop: '5px',
  outline: 'none'
};

export default MeusEventos;