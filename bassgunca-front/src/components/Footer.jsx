import React from 'react';

function Footer({ setTelaAtual, setShowModal }) {
  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid #222',
      padding: '60px 40px 30px',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        borderBottom: '1px solid #222',
        paddingBottom: '40px'
      }}>
        <div style={{ flex: '1 1 250px' }}>
          <h2 className="fonte-quadrada" style={{ color: '#fff', fontSize: '2.5rem', margin: '0 0 15px 0' }}>
            BASS<span style={{ color: '#ff003c' }}>GUNÇA</span>
          </h2>
          <button 
            className="fonte-quadrada" 
            onClick={() => setShowModal(true)} // 👈 Abre o modal de criar evento
            style={{
              background: 'transparent', 
              border: '1px solid #ff003c', 
              color: '#ff003c',
              padding: '10px 20px', 
              cursor: 'pointer', 
              transition: 'all 0.3s',
              fontSize: '0.9rem'
            }}
          >
            PROMOVA SEU ROLÊ ➔
          </button>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 className="fonte-quadrada" style={{ color: '#fff', marginBottom: '20px', fontSize: '1.2rem' }}>SOBRE</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.5' }} className="fonte-texto">
            <li><span onClick={() => setTelaAtual('home')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>O que é a Bassgunça</span></li>
            <li><span onClick={() => setTelaAtual('artistas')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>Para Artistas e DJs</span></li>
            <li><span onClick={() => setTelaAtual('meus_eventos')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>Painel do Produtor</span></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 className="fonte-quadrada" style={{ color: '#fff', marginBottom: '20px', fontSize: '1.2rem' }}>CENAS LOCAIS</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.5' }} className="fonte-texto">
            <li><span onClick={() => setTelaAtual('eventos')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>Brasília (DF)</span></li>
            <li><span onClick={() => setTelaAtual('eventos')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>Ceilândia (DF)</span></li>
            <li><span onClick={() => setTelaAtual('eventos')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>São Paulo (SP)</span></li>
            <li><span onClick={() => setTelaAtual('eventos')} style={{ color: '#ff003c', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', marginTop: '10px', display: 'inline-block' }}>Ver todas as cidades</span></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 className="fonte-quadrada" style={{ color: '#fff', marginBottom: '20px', fontSize: '1.2rem' }}>SUPORTE</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.5' }} className="fonte-texto">
            <li><span onClick={() => setTelaAtual('configuracoes')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>Central de ajuda</span></li>
            <li><span onClick={() => setTelaAtual('configuracoes')} style={{ color: '#aaa', cursor: 'pointer', transition: 'color 0.2s' }}>Minha Conta</span></li>
          </ul>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '30px auto 0',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div className="fonte-texto" style={{ color: '#666', fontSize: '0.85rem' }}>
          <p style={{ margin: '0 0 5px 0' }}>© 2026 Bassgunça. O underground resiste.</p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <span style={{ color: '#666', cursor: 'pointer' }}>Termos de Uso</span>
            <span style={{ color: '#666', cursor: 'pointer' }}>Privacidade</span>
          </div>
        </div>
        
       {/* Redes Sociais */}
<div style={{ display: 'flex', gap: '20px' }}>
  <a href="https://www.instagram.com/bassgunca/" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem' }} title="Instagram da Bassgunça">📷</a>
  
  <a href="https://soundcloud.com" target="_blank" rel="noreferrer" style={{ color: '#ff5500', textDecoration: 'none', fontSize: '1.5rem' }} title="SoundCloud">☁️</a> 
  <a href="https://github.com/iw3lly" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem' }} title="GitHub">💻</a>
</div>
      </div>
    </footer>
  );
}

export default Footer;