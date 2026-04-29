import React, { useState, useEffect } from 'react';

function Header({ usuarioLogado, setShowModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
      padding: scrolled ? '15px 40px' : '40px 40px 20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: scrolled ? 'blur(10px)' : 'none'
    }}>
      
      <div className="user-info" style={{ transition: 'all 0.3s' }}>
        {/* O título diminui se o usuário scrollar a tela */}
        <h1 className="fonte-quadrada" style={{ 
          margin: 0, 
          fontSize: scrolled ? '1.5rem' : '2.5rem',
          transition: 'font-size 0.3s ease'
        }}>
          SALVE, {(usuarioLogado?.vulgo || usuarioLogado?.nome || '').toUpperCase()}!
        </h1>
        
        {/* A função só aparece quando a tela tá no topo */}
        {!scrolled && (
          <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px' }}>
            Sua função: <span style={{ color: '#fff' }}>{usuarioLogado?.funcoes}</span>
          </p>
        )}
      </div>

      <button 
        className="btn-destaque fonte-quadrada" 
        onClick={() => setShowModal(true)}
        style={{
          transition: 'all 0.3s',
          padding: scrolled ? '10px 20px' : '15px 30px' // Botão também dá uma leve encolhida
        }}
      >
        + NOVO EVENTO
      </button>

    </header>
  );
}

export default Header;