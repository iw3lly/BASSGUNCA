import React, { useState, useEffect } from 'react';

function Header({ usuarioLogado, setShowModal, setTelaAtual, notificacoes = [] }) { 
  const [scrolled, setScrolled] = useState(false);

  // Conta quantas não foram lidas
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 999, transition: 'padding 0.3s ease',
      backgroundColor: '#000000', borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
      padding: scrolled ? '15px 40px' : '40px 40px 20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div className="user-info" style={{ transition: 'all 0.3s' }}>
        <h1 className="fonte-quadrada" style={{ margin: 0, fontSize: scrolled ? '1.5rem' : '2.5rem', transition: 'font-size 0.3s ease', color: '#fff' }}>
          SALVE, {(usuarioLogado?.vulgo || usuarioLogado?.nome || '').toUpperCase()}!
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px', opacity: scrolled ? 0 : 1, maxHeight: scrolled ? 0 : '20px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
          Sua função: <span style={{ color: '#fff' }}>{usuarioLogado?.funcoes || usuarioLogado?.funcao || 'Sem função'}</span>
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
     {/* BOTÃO DE NOTIFICAÇÕES (SINO) */}
<button 
  onClick={() => setTelaAtual('notificacoes')}
  style={{ 
    background: 'transparent', 
    border: 'none', 
    cursor: 'pointer', 
    position: 'relative', 
    fontSize: '1.8rem',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s',
    animation: naoLidas > 0 ? 'balancar 2s infinite' : 'none' // Balança se tiver notificação
  }}
  title="Notificações"
  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
>
  🔔
  
  {naoLidas > 0 && (
    <span className="fonte-quadrada" style={{ 
      position: 'absolute', 
      top: '-2px', 
      right: '-8px', 
      background: '#ff003c', 
      color: '#fff', 
      fontSize: '0.7rem', 
      padding: '2px 6px', 
      borderRadius: '12px', 
      fontWeight: 'bold',
      border: '2px solid #000',
      boxShadow: '0 0 10px rgba(255, 0, 60, 0.5)'
    }}>
      {naoLidas}
    </span>
  )}

  {/* KEYFRAMES PARA O BALANÇO DO SINO */}
  <style>{`
    @keyframes balancar {
      0% { transform: rotate(0); }
      10% { transform: rotate(15deg); }
      20% { transform: rotate(-10deg); }
      30% { transform: rotate(5deg); }
      40% { transform: rotate(-5deg); }
      50% { transform: rotate(0); }
      100% { transform: rotate(0); }
    }
  `}</style>
</button>

        {(usuarioLogado?.funcao?.toUpperCase().includes('PRODUTOR') || usuarioLogado?.funcao?.toUpperCase().includes('EVENTO')) && (
          <button 
            className="btn-destaque fonte-quadrada" 
            onClick={() => setShowModal(true)}
            style={{ padding: scrolled ? '10px 20px' : '15px 30px', background: '#ff003c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + NOVO EVENTO
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;