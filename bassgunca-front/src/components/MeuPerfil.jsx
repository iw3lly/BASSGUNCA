import React, { useState } from 'react';
import { FaInstagram, FaSoundcloud, FaSpotify } from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';

import ModalEditarPerfil from './ModalEditarPerfil'; 

const abaStyle = { 
  background: 'transparent', 
  border: 'none', 
  padding: '15px 5px', 
  fontSize: '0.9rem', 
  cursor: 'pointer', 
  transition: '0.2s',
  letterSpacing: '1px'
};

function MeuPerfil({ usuarioLogado, setUsuarioLogado, eventos }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [abaEventos, setAbaEventos] = useState('produtor'); 

  // ==========================================
  // TROCA DE TELA PARA EDIÇÃO
  // ==========================================
  if (modoEdicao) {
    return (
      <ModalEditarPerfil 
        usuarioLogado={usuarioLogado}
        setUsuarioLogado={setUsuarioLogado}
        onFechar={() => setModoEdicao(false)}
      />
    );
  }

  // ==========================================
  // LÓGICA DAS ABAS
  // ==========================================
  const eventosProdutor = (eventos || []).filter(e => {
    const criador = String(e.criado_por || '').trim().toLowerCase();
    const meuVulgo = String(usuarioLogado?.vulgo || '').trim().toLowerCase();
    return criador === meuVulgo && criador !== '';
  });

  const eventosLineup = (eventos || []).filter(e => {
    const meuVulgo = String(usuarioLogado?.vulgo || '').trim();
    if (!meuVulgo) return false; 
    const regex = new RegExp(`\\b${meuVulgo}\\b`, 'i');
    return regex.test(String(e.titulo || '')) || regex.test(String(e.lista_artistas || e.programacao || ''));
  });
  
  const eventosInteressado = (eventos || []).filter(e => {
    const meuVulgo = String(usuarioLogado?.vulgo || '').trim().toLowerCase();
    if (!meuVulgo) return false;
    return String(e.interessados || '').toLowerCase().includes(meuVulgo);
  });

  const eventosExibidos =
    abaEventos === 'produtor' ? eventosProdutor : 
    abaEventos === 'lineup' ? eventosLineup : eventosInteressado;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', color: '#fff', paddingBottom: '100px' }}>
      
      {/* HEADER DO PERFIL - VITRINE */}
      <div style={{ 
        background: '#050505', 
        padding: '40px', 
        borderRadius: '16px', 
        border: '1px solid #1a1a1a', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img 
            src={usuarioLogado.foto_perfil || 'https://via.placeholder.com/150'} 
            alt="Perfil" 
            style={{ width: '160px', height: '160px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #ff003c' }} 
          />
          
          <div>
            {/* VULGO E NOME REAL */}
            <h2 className="fonte-quadrada" style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase' }}>
              {usuarioLogado.vulgo || 'SEM VULGO'}
            </h2>
            <p className="fonte-texto" style={{ color: '#888', margin: '0 0 15px 0', fontSize: '1.1rem' }}>
              {usuarioLogado.nome}
            </p>

            {/* TAGS DE FUNÇÕES (VOLTARAM!) */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {(usuarioLogado.funcao ? usuarioLogado.funcao.split(', ') : ['Membro']).map(f => (
                <span key={f} className="fonte-quadrada" style={{ 
                  background: '#1a1a1a', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontSize: '0.7rem', 
                  color: '#ff003c', 
                  border: '1px solid #ff003c',
                  letterSpacing: '1px'
                }}>
                  {f.toUpperCase()}
                </span>
              ))}
            </div>

            {/* BIO */}
            <p className="fonte-texto" style={{ color: '#ccc', maxWidth: '500px', lineHeight: '1.5', marginBottom: '20px', fontSize: '0.95rem' }}>
              {usuarioLogado.bio || 'Sem biografia definida.'}
            </p>

            {/* REDES SOCIAIS COM HOVER */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {usuarioLogado?.link_instagram && (
                <a href={usuarioLogado.link_instagram} target="_blank" rel="noreferrer" style={{ color: '#888', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#ff003c'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                  <FaInstagram size={26} />
                </a>
              )}
              {usuarioLogado?.link_soundcloud && (
                <a href={usuarioLogado.link_soundcloud} target="_blank" rel="noreferrer" style={{ color: '#888', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#ff003c'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                  <FaSoundcloud size={26} />
                </a>
              )}
              {usuarioLogado?.link_spotify && (
                <a href={usuarioLogado.link_spotify} target="_blank" rel="noreferrer" style={{ color: '#888', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#1DB954'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                  <FaSpotify size={26} />
                </a>
              )}
              {usuarioLogado?.link_geral && (
                <a href={usuarioLogado.link_geral} target="_blank" rel="noreferrer" style={{ color: '#888', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#ff003c'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                  <SiLinktree size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setModoEdicao(true)} 
          className="fonte-quadrada"
          style={{ 
            background: 'transparent', 
            color: '#ff003c', 
            border: '1px solid #ff003c', 
            padding: '10px 20px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          EDITAR PERFIL
        </button>
      </div>

      {/* SEÇÃO DE EVENTOS */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px', borderBottom: '1px solid #1a1a1a' }}>
        {['produtor', 'lineup', 'interessado'].map(aba => (
          <button 
            key={aba}
            onClick={() => setAbaEventos(aba)} 
            className="fonte-quadrada"
            style={{ 
              ...abaStyle, 
              color: abaEventos === aba ? '#ff003c' : '#666', 
              borderBottom: abaEventos === aba ? '2px solid #ff003c' : '2px solid transparent' 
            }}
          >
            {aba.toUpperCase()} ({aba === 'produtor' ? eventosProdutor.length : aba === 'lineup' ? eventosLineup.length : eventosInteressado.length})
          </button>
        ))}
      </div>

      {/* GRID DE EVENTOS */}
      <div style={{ marginTop: '30px' }}>
        {eventosExibidos.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#0a0a0a', borderRadius: '12px', border: '1px dashed #222' }}>
             <p className="fonte-texto" style={{ color: '#444' }}>Nenhum evento encontrado nesta categoria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {eventosExibidos.map(e => (
              <div key={e.id} style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                <h4 className="fonte-quadrada" style={{ color: '#ff003c', margin: '0 0 10px 0', fontSize: '1.2rem' }}>{e.titulo}</h4>
                <p className="fonte-texto" style={{ color: '#888', margin: '0 0 5px 0', fontSize: '0.9rem' }}>📍 {e.local}</p>
                <p className="fonte-texto" style={{ color: '#555', margin: 0, fontSize: '0.8rem' }}>📅 {new Date(e.data_hora).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeuPerfil;