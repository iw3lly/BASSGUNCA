import React, { useState, useEffect } from 'react';

function Header({ usuarioLogado, setShowModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aumentei um pouco o limite para não ativar com qualquer esbarrão no mouse
      setScrolled(window.scrollY > 40);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 999,
      // Removida a transição de cor de fundo, deixamos só para padding e tamanho
      transition: 'padding 0.3s ease',
      // COR SÓLIDA SEMPRE. Coloque a mesma cor do fundo do seu App (ex: #000 ou #050505)
      backgroundColor: '#000000', 
      borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
      padding: scrolled ? '15px 40px' : '40px 40px 20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      
      <div className="user-info" style={{ transition: 'all 0.3s' }}>
        <h1 className="fonte-quadrada" style={{ 
          margin: 0, 
          fontSize: scrolled ? '1.5rem' : '2.5rem',
          transition: 'font-size 0.3s ease',
          color: '#fff'
        }}>
          SALVE, {(usuarioLogado?.vulgo || usuarioLogado?.nome || '').toUpperCase()}!
        </h1>
        
        {/* Usando opacity em vez de remover o elemento evita pulos bruscos no layout */}
        <p style={{ 
            fontSize: '0.9rem', 
            color: '#aaa', 
            marginTop: '5px',
            opacity: scrolled ? 0 : 1,
            maxHeight: scrolled ? 0 : '20px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
          Sua função: <span style={{ color: '#fff' }}>{usuarioLogado?.funcoes || usuarioLogado?.funcao || 'Sem função'}</span>
        </p>
      </div>

{(usuarioLogado?.funcao?.toUpperCase().includes('PRODUTOR') || 
  usuarioLogado?.funcao?.toUpperCase().includes('EVENTO')) ? (
      <button 
        className="btn-destaque fonte-quadrada" 
        onClick={() => setShowModal(true)}
        style={{
          transition: 'all 0.1s',
          padding: scrolled ? '10px 20px' : '15px 30px',
          background: '#ff003c',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        + NOVO EVENTO
      </button>
) : null}
    </header>
  );
}

export default Header;