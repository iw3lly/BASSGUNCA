import React, { useState } from 'react';

// Estilos padronizados
const labelStyle = { color: '#666', fontSize: '0.75rem', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '12px', background: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginTop: '5px', outline: 'none', fontSize: '0.9rem' };
const btnStyle = { background: '#ff003c', color: '#fff', border: 'none', padding: '20px', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', width: '100%' };

function EditarPerfil({ usuarioLogado, setUsuarioLogado, onFechar }) {
  // Puxa as infos do usuário logado pro estado de edição
  const [editando, setEditando] = useState({ ...usuarioLogado });

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioLogado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editando)
      });
      
      if (response.ok) {
        alert("🔥 Identidade atualizada na cena!");
        if (setUsuarioLogado) setUsuarioLogado(editando);
        if (onFechar) onFechar();
        
        // Dá um refresh maroto pra garantir que a foto no header e tudo mais atualize
        window.location.reload(); 
      } else {
        alert("Erro do servidor ao salvar as alterações.");
      }
    } catch (err) { 
      alert("Erro de conexão com o banco!");
      console.error("Erro no fetch:", err); 
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', color: '#fff', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="fonte-quadrada" style={{ fontSize: '2.5rem', margin: 0 }}>EDITAR PERFIL</h2>
          <p className="fonte-texto" style={{ color: '#666' }}>Ajuste sua identidade no Bassgunça.</p>
        </div>
        {/* Botão de fechar/cancelar caso seja um modal ou tela sobreposta */}
        {onFechar && (
          <button onClick={onFechar} style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
            CANCELAR
          </button>
        )}
      </header>

      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* BLOCO 1: IDENTIDADE VISUAL */}
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '30px', background: '#0a0a0a', padding: '30px', borderRadius: '12px', border: '1px solid #1a1a1a', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
             <img 
               src={editando.foto_perfil || 'https://via.placeholder.com/150'} 
               alt="Preview" 
               style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #ff003c' }} 
             />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <label className="fonte-texto" style={labelStyle}>URL DA FOTO DE PERFIL
                <input type="text" value={editando.foto_perfil || ''} onChange={e => setEditando({...editando, foto_perfil: e.target.value})} style={inputStyle} placeholder="Link da sua imagem..." />
             </label>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label className="fonte-texto" style={labelStyle}>NOME REAL
                   <input type="text" value={editando.nome || ''} onChange={e => setEditando({...editando, nome: e.target.value})} style={inputStyle} />
                </label>
                <label className="fonte-texto" style={labelStyle}>VULGO
                   <input type="text" value={editando.vulgo || ''} onChange={e => setEditando({...editando, vulgo: e.target.value})} style={inputStyle} />
                </label>
             </div>
          </div>
        </div>

        {/* BLOCO 2: INFO & FUNÇÕES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label className="fonte-texto" style={labelStyle}>DATA DE NASCIMENTO
                 <input type="date" value={editando.data_nascimento?.split('T')[0] || ''} onChange={e => setEditando({...editando, data_nascimento: e.target.value})} style={inputStyle} />
              </label>
              <label className="fonte-texto" style={labelStyle}>BIO (SOBRE VOCÊ)
                 <textarea value={editando.bio || ''} onChange={e => setEditando({...editando, bio: e.target.value})} style={{ ...inputStyle, height: '120px', resize: 'none' }} placeholder="Fale um pouco sobre você..." />
              </label>
           </div>

           <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
              <label className="fonte-texto" style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '15px' }}>SUAS FUNÇÕES NA CENA</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['Artista', 'Produtor', 'Banda/Grupo', 'Público', 'Evento', 'Outros'].map(f => {
                  const funcoesAtuais = editando.funcao ? editando.funcao.split(', ') : [];
                  const selecionado = funcoesAtuais.includes(f);
                  const toggle = () => {
                    const nova = selecionado ? funcoesAtuais.filter(i => i !== f) : [...funcoesAtuais, f];
                    setEditando({ ...editando, funcao: nova.join(', ') });
                  };
                  return (
                    <div key={f} onClick={toggle} className="fonte-quadrada" style={{ 
                      padding: '10px', textAlign: 'center', cursor: 'pointer', borderRadius: '4px', fontSize: '0.8rem',
                      background: selecionado ? '#ff003c' : '#050505', 
                      border: selecionado ? '1px solid #ff003c' : '1px solid #333' 
                    }}>{f.toUpperCase()}</div>
                  );
                })}
              </div>
           </div>
        </div>

        {/* BLOCO 3: AS NOVAS REDES SOCIAIS! */}
        <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
          <h3 className="fonte-quadrada" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>LINKS E PORTFÓLIO</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label className="fonte-texto" style={labelStyle}>INSTAGRAM
              <input type="url" value={editando.link_instagram || ''} onChange={e => setEditando({...editando, link_instagram: e.target.value})} style={inputStyle} placeholder="https://instagram.com/..." />
            </label>
            <label className="fonte-texto" style={labelStyle}>SOUNDCLOUD
              <input type="url" value={editando.link_soundcloud || ''} onChange={e => setEditando({...editando, link_soundcloud: e.target.value})} style={inputStyle} placeholder="https://soundcloud.com/..." />
            </label>
            <label className="fonte-texto" style={labelStyle}>SPOTIFY
              <input type="url" value={editando.link_spotify || ''} onChange={e => setEditando({...editando, link_spotify: e.target.value})} style={inputStyle} placeholder="https://open.spotify.com/..." />
            </label>
            <label className="fonte-texto" style={labelStyle}>LINK GERAL / LINKTREE
              <input type="url" value={editando.link_geral || ''} onChange={e => setEditando({...editando, link_geral: e.target.value})} style={inputStyle} placeholder="https://linktr.ee/..." />
            </label>
          </div>
        </div>

        <button type="submit" className="fonte-quadrada" style={btnStyle}>GRAVAR IDENTIDADE</button>
      </form>
    </div>
  );
}

export default EditarPerfil;