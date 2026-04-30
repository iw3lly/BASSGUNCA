import React, { useState } from 'react';

function MeuPerfil({ usuarioLogado, setUsuarioLogado, eventos }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [abaEventos, setAbaEventos] = useState('produtor'); 
  const [editando, setEditando] = useState({ ...usuarioLogado });
  console.log("MEU VULGO:", usuarioLogado?.vulgo);
console.log("TODOS OS EVENTOS QUE CHEGARAM AQUI:", eventos);

  // ==========================================
  // LÓGICA DAS ABAS DE EVENTOS
  // ==========================================
  const eventosProdutor = (eventos || []).filter(e => {
    const criador = String(e.criado_por || '').trim().toLowerCase();
    const meuVulgo = String(usuarioLogado?.vulgo || '').trim().toLowerCase();
    return criador === meuVulgo && criador !== '';
  });

  
const eventosLineup = (eventos || []).filter(e => {
    const meuVulgo = String(usuarioLogado?.vulgo || '').trim().toLowerCase();
    const titulo = String(e.titulo || '').toLowerCase();
    const lineUp = String(e.lista_artistas || e.programacao || '').toLowerCase(); 
    
    if (!meuVulgo) return false; 
    
    const taNoTitulo = titulo.includes(meuVulgo);
    const taNoLine = lineUp.includes(meuVulgo);

    // Tirei o console.log e a trava do !isProdutor. 
    // Agora, se seu nome tá no line, aparece na aba, independente de quem criou.
    return (taNoTitulo || taNoLine);
  });
  
  const eventosInteressado = (eventos || []).filter(e => {
    const meuVulgo = String(usuarioLogado?.vulgo || '').trim().toLowerCase();
    if (!meuVulgo) return false;

    // Tenta achar na coluna 'interessados' (que é o padrão). 
    // Se o seu banco usar outro nome, o console.log abaixo vai nos mostrar.
    const listaInteressados = String(e.interessados || '').toLowerCase();
    
    return listaInteressados.includes(meuVulgo);
  });

  const handleSalvar = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioLogado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editando)
    });
    
    if (response.ok) {
      alert("Perfil atualizado!");
      setUsuarioLogado(editando);
      setModoEdicao(false); // Adiciona isso pra ele fechar a edição sozinho ao salvar
    } else {
      // Se o servidor recusar, ele vai mostrar o erro na tela
      const erro = await response.json();
      alert("Erro do servidor: Verifique o console. Detalhe: " + JSON.stringify(erro));
      console.log("Erro completo do back-end:", erro);
    }
  } catch (err) { 
    alert("Erro de conexão! O back-end tá rodando certinho?");
    console.error("Erro no fetch:", err); 
  }
};

  // ==========================================
  // TELA 1: O SEU CÓDIGO DE EDIÇÃO INTACTO
  // ==========================================
  if (modoEdicao) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', color: '#fff', paddingBottom: '100px' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="fonte-quadrada" style={{ fontSize: '2.5rem', margin: 0 }}>EDITAR PERFIL</h2>
            <p className="fonte-texto" style={{ color: '#666' }}>Edite sua identidade na cena.</p>
          </div>
          <button onClick={() => setModoEdicao(false)} style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>CANCELAR</button>
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
                  <input type="text" value={editando.foto_perfil || ''} onChange={e => setEditando({...editando, foto_perfil: e.target.value})} style={inputStyle} placeholder="Link da imagem..." />
               </label>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <label className="fonte-texto" style={labelStyle}>NOME REAL
                     <input type="text" value={editando.nome} onChange={e => setEditando({...editando, nome: e.target.value})} style={inputStyle} />
                  </label>
                  <label className="fonte-texto" style={labelStyle}>VULGO
                     <input type="text" value={editando.vulgo} onChange={e => setEditando({...editando, vulgo: e.target.value})} style={inputStyle} />
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
                   <textarea value={editando.bio || ''} onChange={e => setEditando({...editando, bio: e.target.value})} style={{ ...inputStyle, height: '120px', resize: 'none' }} />
                </label>
             </div>

             <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                <label className="fonte-texto" style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '15px' }}>SUAS FUNÇÕES</label>
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

          {/* BLOCO 3: CONEXÕES */}
          <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
            <h3 className="fonte-quadrada" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>CONEXÕES E PORTFÓLIO</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {['instagram', 'soundcloud', 'youtube', 'spotify'].map(rede => (
                <label key={rede} className="fonte-texto" style={labelStyle}>{rede.toUpperCase()}
                  <input 
                    type="text" 
                    value={editando.redes_sociais?.[rede] || ''} 
                    onChange={e => setEditando({...editando, redes_sociais: {...editando.redes_sociais, [rede]: e.target.value}})} 
                    style={inputStyle} 
                    placeholder={`link do seu ${rede}...`}
                  />
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="fonte-quadrada" style={btnStyle}>SALVAR ALTERAÇÕES</button>
        </form>
      </div>
    );
  }

  // ==========================================
  // TELA 2: MODO VITRINE (PERFIL PÚBLICO)
  // ==========================================
  const eventosExibidos = abaEventos === 'produtor' ? eventosProdutor : abaEventos === 'lineup' ? eventosLineup : eventosInteressado;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', color: '#fff', paddingBottom: '100px' }}>
      
      {/* HEADER DO PERFIL */}
      <div style={{ background: '#050505', padding: '40px', borderRadius: '16px', border: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img 
            src={usuarioLogado.foto_perfil || 'https://via.placeholder.com/150'} 
            alt="Perfil" 
            style={{ width: '160px', height: '160px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #ff003c' }} 
          />
          
          <div>
            <h2 className="fonte-quadrada" style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase' }}>{usuarioLogado.vulgo || 'W3LLY'}</h2>
            <p className="fonte-texto" style={{ color: '#888', margin: '0 0 15px 0' }}>{usuarioLogado.nome}</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {(usuarioLogado.funcao ? usuarioLogado.funcao.split(', ') : ['Membro']).map(f => (
                <span key={f} className="fonte-quadrada" style={{ background: '#1a1a1a', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#ff003c', border: '1px solid #ff003c' }}>
                  {f.toUpperCase()}
                </span>
              ))}
            </div>

            <p className="fonte-texto" style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.4', margin: '0 0 15px 0', maxWidth: '500px' }}>{usuarioLogado.bio}</p>

            {/* LINKS LIMPOS (Sem ícones, só os preenchidos) */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {usuarioLogado.redes_sociais && Object.entries(usuarioLogado.redes_sociais).map(([rede, link]) => {
                  if (!link) return null; // Se estiver vazio, não aparece
                  return (
                    <a key={rede} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" className="fonte-texto" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', borderBottom: '1px solid #333', paddingBottom: '2px', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.7}>
                      {rede.toUpperCase()}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>

        {/* BOTÃO ISOLADO À DIREITA */}
        <button onClick={() => setModoEdicao(true)} className="fonte-quadrada" style={{ background: 'transparent', color: '#ff003c', border: '1px solid #ff003c', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
            EDITAR PERFIL
        </button>
      </div>

      {/* ABAS DE EVENTOS */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px', borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={() => setAbaEventos('produtor')} className="fonte-quadrada" style={{ ...abaStyle, borderBottom: abaEventos === 'produtor' ? '2px solid #ff003c' : '2px solid transparent', color: abaEventos === 'produtor' ? '#fff' : '#666' }}>
          PRODUTOR ({eventosProdutor.length})
        </button>
        <button onClick={() => setAbaEventos('lineup')} className="fonte-quadrada" style={{ ...abaStyle, borderBottom: abaEventos === 'lineup' ? '2px solid #ff003c' : '2px solid transparent', color: abaEventos === 'lineup' ? '#fff' : '#666' }}>
          NO LINE-UP ({eventosLineup.length})
        </button>
        <button onClick={() => setAbaEventos('interessado')} className="fonte-quadrada" style={{ ...abaStyle, borderBottom: abaEventos === 'interessado' ? '2px solid #ff003c' : '2px solid transparent', color: abaEventos === 'interessado' ? '#fff' : '#666' }}>
          INTERESSADO ({eventosInteressado.length})
        </button>
      </div>

      {/* GRID DE EVENTOS */}
      <div style={{ marginTop: '30px' }}>
        {eventosExibidos.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#0a0a0a', borderRadius: '12px', border: '1px dashed #222' }}>
            <p className="fonte-texto" style={{ color: '#444' }}>
              {/* Dentro da aba de Produtor */}
{abaEventos === 'produtor' && (
  <div>
    {/* CASO 1: O cara NÃO é produtor nem evento */}
    {!(usuarioLogado?.funcao?.toUpperCase().includes('PRODUTOR') || 
       usuarioLogado?.funcao?.toUpperCase().includes('EVENTO')) ? (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#0a0a0a', borderRadius: '12px', border: '1px dashed #333' }}>
        <h3 className="fonte-quadrada" style={{ fontSize: '1.5rem', color: '#ff003c' }}>ACESSO RESTRITO</h3>
        <p className="fonte-texto" style={{ color: '#888', maxWidth: '450px', margin: '15px auto' }}>
          Esta aba é exclusiva para organizadores e produtores da cena. 
          Deseja cadastrar seus próprios eventos no Bassgunça?
        </p>
        <button className="fonte-quadrada" style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
          SOLICITAR PERFIL PRODUTOR
        </button>
      </div>
    ) : (
      /* CASO 2: O cara É produtor, mas ainda não criou nada */
      eventosProdutor.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#0a0a0a', borderRadius: '12px' }}>
          <p className="fonte-texto" style={{ color: '#666' }}>Você ainda não publicou nenhum evento.</p>
        </div>
      ) : (
        /* CASO 3: Ele é produtor e tem eventos (o seu grid atual) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {eventosProdutor.map(evento => (
            <div key={evento.id} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
              <h4 className="fonte-quadrada" style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#ff003c' }}>{evento.titulo}</h4>
              {/* ... resto do seu card ... */}
            </div>
          ))}
        </div>
      )
    )}
  </div>
)}
              {abaEventos === 'lineup' && 'Você ainda não aparece no line-up de nenhum evento.'}
              {abaEventos === 'interessado' && 'Você ainda não tem eventos marcados como interessado.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {eventosExibidos.map(evento => (
              <div key={evento.id} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                <h4 className="fonte-quadrada" style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#ff003c' }}>{evento.titulo}</h4>
                <p className="fonte-texto" style={{ margin: '0 0 5px 0', color: '#888', fontSize: '0.85rem' }}>📍 {evento.local}</p>
                <p className="fonte-texto" style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>📅 {new Date(evento.data_hora).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos padronizados
const labelStyle = { color: '#666', fontSize: '0.75rem', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '12px', background: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginTop: '5px', outline: 'none', fontSize: '0.9rem' };
const btnStyle = { background: '#ff003c', color: '#fff', border: 'none', padding: '20px', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' };
const abaStyle = { background: 'transparent', border: 'none', padding: '15px 5px', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' };

export default MeuPerfil;