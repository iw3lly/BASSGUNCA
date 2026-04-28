import React from 'react';

function Sidebar({ 
  logoImg, 
  telaAtual, 
  setTelaAtual, 
  voltarParaHome, 
  handleSair 
}) {
  return (
    <aside className="sidebar">
      <img src={logoImg} alt="Logo" className="logo-img-side" />
      
      <nav className="menu-nav">
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'home' ? 'ativo' : ''}`} 
          onClick={voltarParaHome}
        >
          HOME
        </div>
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'eventos' ? 'ativo' : ''}`} 
          onClick={() => setTelaAtual('eventos')}
        >
          EVENTOS
        </div>
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'artistas' ? 'ativo' : ''}`} 
          onClick={() => setTelaAtual('artistas')}
        >
          ARTISTAS
        </div>
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'feed' ? 'ativo' : ''}`} 
          onClick={() => setTelaAtual('feed')}
        >
          FEED
        </div>
      </nav>

      <div style={{ flexGrow: 1 }}></div>

      <nav className="menu-nav" style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'meus_eventos' ? 'ativo' : ''}`} 
          onClick={() => setTelaAtual('meus_eventos')}
        >
          MEUS EVENTOS
        </div>
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'meu_perfil' ? 'ativo' : ''}`} 
          onClick={() => setTelaAtual('meu_perfil')}
        >
          MEU PERFIL
        </div>
        <div 
          className={`menu-item fonte-quadrada ${telaAtual === 'configuracoes' ? 'ativo' : ''}`} 
          onClick={() => setTelaAtual('configuracoes')}
        >
          CONFIGURAÇÕES
        </div>
      </nav>

      <button 
        className="btn-sair fonte-quadrada" 
        style={{ marginTop: '20px' }} 
        onClick={handleSair}
      >
        SAIR
      </button>
    </aside>
  );
}

export default Sidebar;