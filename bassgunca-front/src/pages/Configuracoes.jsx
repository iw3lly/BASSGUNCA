import React, { useState } from 'react';

const Configuracoes = ({ usuarioLogado, setUsuarioLogado }) => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem!' });
      return;
    }
    
    // Aqui você criaria uma rota no back-end específica para senha
    // Por enquanto, vamos simular o alerta
    setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
  };

  const handleExcluirConta = () => {
    const confirmar = window.confirm("TEM CERTEZA? Isso vai apagar todo seu histórico no Bassgunça e não tem volta.");
    if (confirmar) {
      console.log("Conta excluída");
      // Lógica de DELETE no back-end aqui
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1 className="fonte-quadrada" style={{ fontSize: '2.5rem', marginBottom: '40px', borderLeft: '5px solid #ff003c', paddingLeft: '20px' }}>
        CONFIGURAÇÕES
      </h1>

      {/* SEÇÃO 1: SEGURANÇA */}
      <section style={{ background: '#0a0a0a', padding: '30px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #1a1a1a' }}>
        <h2 className="fonte-quadrada" style={{ color: '#ff003c', marginBottom: '20px' }}>ALTERAR SENHA</h2>
        <form onSubmit={handleAlterarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            placeholder="Senha Atual" 
            className="input-bass" 
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="Nova Senha" 
              className="input-bass" 
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Confirmar Nova Senha" 
              className="input-bass" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-save-bass" style={{ width: 'fit-content' }}>
            ATUALIZAR SENHA
          </button>
        </form>
        {mensagem.texto && (
          <p style={{ marginTop: '15px', color: mensagem.tipo === 'sucesso' ? '#00ff00' : '#ff003c' }}>
            {mensagem.texto}
          </p>
        )}
      </section>

      {/* SEÇÃO 2: PRIVACIDADE / PREFERÊNCIAS */}
      <section style={{ background: '#0a0a0a', padding: '30px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #1a1a1a' }}>
        <h2 className="fonte-quadrada" style={{ color: '#ff003c', marginBottom: '20px' }}>PREFERÊNCIAS</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
          <div>
            <p className="fonte-texto" style={{ margin: 0 }}>Perfil Público</p>
            <small style={{ color: '#666' }}>Permitir que outros vejam seu Line-up e conquistas.</small>
          </div>
          <input type="checkbox" defaultChecked />
        </div>
      </section>

      {/* SEÇÃO 3: ZONA DE PERIGO */}
      <section style={{ background: '#0a0a0a', padding: '30px', borderRadius: '12px', border: '1px solid #330000' }}>
        <h2 className="fonte-quadrada" style={{ color: '#555', marginBottom: '20px' }}>ZONA DE PERIGO</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p className="fonte-texto" style={{ color: '#888' }}>
            Ao excluir sua conta, você perderá acesso a todos os seus eventos e dados permanentemente.
          </p>
          <button 
            onClick={handleExcluirConta}
            style={{ background: 'transparent', color: '#ff003c', border: '1px solid #ff003c', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            EXCLUIR CONTA
          </button>
        </div>
      </section>

      <style>{`
        .input-bass {
          background: #151515;
          border: 1px solid #333;
          padding: 12px;
          color: #fff;
          border-radius: 6px;
          width: 100%;
          outline: none;
        }
        .input-bass:focus { border-color: #ff003c; }
        .btn-save-bass {
          background: #ff003c;
          color: #fff;
          border: none;
          padding: 12px 25px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default Configuracoes;