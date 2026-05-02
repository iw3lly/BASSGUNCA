import React, { useState } from 'react';

function PerfilUsuario({ perfil, eventos, onVoltar, usuarioLogado }) {
  const [abaEventos, setAbaEventos] = useState('produtor');

  // Proteção caso o perfil demore a carregar
  if (!perfil) return <div style={{ color: '#fff', padding: '40px' }}>Localizando sinal do usuário...</div>;

  // ==========================================
  // LÓGICA DE FILTRAGEM (USANDO REGEX PARA EVITAR ERRO BEA/BEAT)
  // ==========================================
  const vulgoAlvo = String(perfil.vulgo || '').trim();
  const regexPalavraExata = new RegExp(`\\b${vulgoAlvo}\\b`, 'i');

  const eventosProdutor = (eventos || []).filter(e => {
    const criador = String(e.criado_por || '').trim();
    return regexPalavraExata.test(criador);
  });

  const eventosLineup = (eventos || []).filter(e => {
    const titulo = String(e.titulo || '');
    const lineUp = String(e.lista_artistas || e.programacao || '');
    return regexPalavraExata.test(titulo) || regexPalavraExata.test(lineUp);
  });

  const eventosInteressado = (eventos || []).filter(e => {
    const listaInteressados = String(e.interessados || '');
    return regexPalavraExata.test(listaInteressados);
  });

  const eventosExibidos = abaEventos === 'produtor' ? eventosProdutor : abaEventos === 'lineup' ? eventosLineup : eventosInteressado;

  // Verifica se o perfil visualizado é o do próprio usuário logado
  const ehMeuProprioPerfil = usuarioLogado?.vulgo?.toLowerCase() === perfil.vulgo?.toLowerCase();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', color: '#fff', paddingBottom: '100px' }}>
      
      {/* BOTÃO VOLTAR */}
      <button onClick={onVoltar} style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '0.9rem' }}>
        ← VOLTAR PARA O FEED
      </button>

      {/* HEADER DO PERFIL (IGUAL AO MEU PERFIL) */}
      <div style={{ background: '#050505', padding: '40px', borderRadius: '16px', border: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img 
            src={perfil.foto_perfil || 'https://via.placeholder.com/150'} 
            alt="Perfil" 
            style={{ width: '160px', height: '160px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #ff003c' }} 
          />
          
          <div>
            <h2 className="fonte-quadrada" style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase' }}>{perfil.vulgo || 'BASSGUNÇO'}</h2>
            <p className="fonte-texto" style={{ color: '#888', margin: '0 0 15px 0' }}>{perfil.nome}</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {(perfil.funcao ? perfil.funcao.split(', ') : ['Membro']).map(f => (
                <span key={f} className="fonte-quadrada" style={{ background: '#1a1a1a', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#ff003c', border: '1px solid #ff003c' }}>
                  {f.toUpperCase()}
                </span>
              ))}
            </div>

            <p className="fonte-texto" style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.4', margin: '0 0 15px 0', maxWidth: '500px' }}>{perfil.bio}</p>

            {/* LINKS SOCIAIS */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {perfil.redes_sociais && Object.entries(perfil.redes_sociais).map(([rede, link]) => {
                  if (!link) return null;
                  return (
                    <a key={rede} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" className="fonte-texto" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.8rem', borderBottom: '1px solid #333', paddingBottom: '2px', opacity: 0.7 }}>
                      {rede.toUpperCase()}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>

        {/* SÓ MOSTRA O BOTÃO SE FOR O DONO DO PERFIL CLICANDO NO PRÓPRIO NOME NO FEED */}
        {ehMeuProprioPerfil && (
          <button className="fonte-quadrada" style={{ background: 'transparent', color: '#ff003c', border: '1px solid #ff003c', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
              EDITAR PERFIL
          </button>
        )}
      </div>

      {/* ABAS DE EVENTOS */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px', borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={() => setAbaEventos('produtor')} className="fonte-quadrada" style={{ ...abaStyle, borderBottom: abaEventos === 'produtor' ? '2px solid #ff003c' : '2px solid transparent', color: abaEventos === 'produtor' ? '#fff' : '#666' }}>
          PRODUÇÕES ({eventosProdutor.length})
        </button>
        <button onClick={() => setAbaEventos('lineup')} className="fonte-quadrada" style={{ ...abaStyle, borderBottom: abaEventos === 'lineup' ? '2px solid #ff003c' : '2px solid transparent', color: abaEventos === 'lineup' ? '#fff' : '#666' }}>
          APARIÇÕES ({eventosLineup.length})
        </button>
        <button onClick={() => setAbaEventos('interessado')} className="fonte-quadrada" style={{ ...abaStyle, borderBottom: abaEventos === 'interessado' ? '2px solid #ff003c' : '2px solid transparent', color: abaEventos === 'interessado' ? '#fff' : '#666' }}>
          PRESENÇA ({eventosInteressado.length})
        </button>
      </div>

      {/* GRID DE EVENTOS */}
      <div style={{ marginTop: '30px' }}>
        {eventosExibidos.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#0a0a0a', borderRadius: '12px', border: '1px dashed #222' }}>
            <p className="fonte-texto" style={{ color: '#444' }}>Nenhum evento registrado nesta categoria.</p>
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

const abaStyle = { background: 'transparent', border: 'none', padding: '15px 5px', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' };

export default PerfilUsuario;