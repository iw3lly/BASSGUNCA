import React from 'react';

function DetalheEvento({ evento, onVoltar }) {
  if (!evento) return null;

  return (
    <div className="pagina-detalhe" style={{background: '#080808', padding: '30px', border: '1px solid #111', marginTop: '20px'}}>
      <button className="btn-acao fonte-quadrada" style={{marginBottom: '20px'}} onClick={onVoltar}>
        ⬅ VOLTAR
      </button>
      
      <h1 className="fonte-quadrada" style={{color: '#ff003c', fontSize: '3rem'}}>{evento.titulo}</h1>
      <h3 className="fonte-texto" style={{color: '#aaa', marginTop: '10px'}}>📍 {evento.local}</h3>
      
      <div style={{display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid #222', paddingTop: '20px'}}>
        <div style={{flex: 1}}>
          <h4 className="fonte-quadrada" style={{color: '#fff'}}>DATA E HORA</h4>
          <p className="fonte-texto" style={{color: '#aaa'}}>
            Início: {new Date(evento.data_hora).toLocaleString('pt-BR')} <br/>
            {evento.data_fim && `Fim: ${new Date(evento.data_fim).toLocaleString('pt-BR')}`}
          </p>
        </div>
        <div style={{flex: 1}}>
          <h4 className="fonte-quadrada" style={{color: '#fff'}}>GÊNEROS</h4>
          <p className="fonte-texto" style={{color: '#aaa'}}>{evento.generos || 'Não informado'}</p>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <h4 className="fonte-quadrada" style={{color: '#ff003c', fontSize: '1.5rem'}}>LINE-UP</h4>
        <p className="fonte-texto" style={{color: '#fff', fontSize: '1.2rem'}}>{evento.lista_artistas || 'Line-up em construção...'}</p>
      </div>

      {evento.link_ingresso && (
        <a href={evento.link_ingresso} target="_blank" rel="noreferrer" className="btn-destaque fonte-quadrada" style={{display: 'inline-block', marginTop: '30px', textDecoration: 'none'}}>
          🎟️ GARANTIR INGRESSO
        </a>
      )}
    </div>
  );
}

export default DetalheEvento;