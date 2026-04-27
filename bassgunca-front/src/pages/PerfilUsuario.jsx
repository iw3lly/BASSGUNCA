import React from 'react';

function PerfilUsuario({ perfil, eventosDoPerfil, onVoltar }) {
  if (!perfil) return null;

  return (
    <div className="pagina-perfil" style={{background: '#080808', padding: '30px', border: '1px solid #111', marginTop: '20px'}}>
      <button className="btn-acao fonte-quadrada" style={{marginBottom: '20px'}} onClick={onVoltar}>
        ⬅ VOLTAR
      </button>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <div style={{width: '100px', height: '100px', borderRadius: '50%', background: '#ff003c', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span className="fonte-quadrada" style={{color: '#fff', fontSize: '2.5rem'}}>
            {perfil.vulgo.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="fonte-quadrada" style={{color: '#fff', fontSize: '2.5rem'}}>{perfil.vulgo}</h1>
          <span className="fonte-texto" style={{color: '#aaa'}}>Faz parte da Bassgunça</span>
        </div>
      </div>

      <div style={{marginTop: '40px'}}>
        <h3 className="fonte-quadrada" style={{borderBottom: '1px solid #222', paddingBottom: '10px'}}>
          EVENTOS NA LINE-UP ({eventosDoPerfil.length})
        </h3>
        
        {eventosDoPerfil.length === 0 ? (
          <p className="fonte-texto" style={{color: '#666', marginTop: '10px'}}>Nenhum evento agendado ainda.</p>
        ) : (
          <div className="event-list" style={{marginTop: '20px'}}>
            {eventosDoPerfil.map(e => (
              <div key={e.id} className="event-strip" style={{padding: '15px'}}>
                <span className="fonte-quadrada" style={{color: '#ff003c'}}>{e.titulo}</span>
                <span className="fonte-texto" style={{color: '#aaa', fontSize: '0.8rem'}}>📍 {e.local}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilUsuario;