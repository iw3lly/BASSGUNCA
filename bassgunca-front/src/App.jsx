import { useState, useEffect } from 'react'
import './App.css'
import logoImg from './assets/logo.png' 
import Login from './Login'
import DetalheEvento from './pages/DetalheEvento'
import PerfilUsuario from './pages/PerfilUsuario'
import ListaEventos from './pages/ListaEventos'
import Home from './pages/Home' // Importando a nova página

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const userSalvo = localStorage.getItem('@bassgunca:user')
    return userSalvo ? JSON.parse(userSalvo) : null
  }) 

  const [eventos, setEventos] = useState([])
  const [telaAtual, setTelaAtual] = useState('home') // Nome atualizado para 'home'
  const [feed, setFeed] = useState([])
  const [novoPost, setNovoPost] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [novoEvento, setNovoEvento] = useState({ titulo: '', local: '', data_hora: '', data_fim: '', tipo_evento: 'unico', generos: '', link_ingresso: '', lista_artistas: '' })
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [perfilSelecionado, setPerfilSelecionado] = useState(null)
  const [eventosDoPerfil, setEventosDoPerfil] = useState([])

  // FUNÇÕES DE CARREGAMENTO
  const carregarFeed = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/api/feed');
      const dados = await resposta.json();
      setFeed(dados);
    } catch (erro) { console.error("Erro ao carregar feed", erro); }
  }
  
  const carregarEventos = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/api/eventos');
      const dados = await resposta.json();
      setEventos(dados);
    } catch (erro) { console.error(erro); }
  }

  useEffect(() => {
    if (usuarioLogado) {
      carregarEventos();
      carregarFeed(); 
    }
  }, [usuarioLogado])

  // HANDLERS
  const handleToggleInteresse = async (idEvento) => {
    const meuVulgo = (usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase();
    try {
      const resposta = await fetch(`http://localhost:3000/api/eventos/${idEvento}/interesse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vulgo: meuVulgo })
      });
      if (resposta.ok) carregarEventos(); 
    } catch (erro) { console.error("Erro ao marcar interesse", erro); }
  }

  const handlePostarFeed = async (e) => {
    e.preventDefault()
    if(!novoPost.trim()) return;
    const vulgoAutor = (usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase();
    try {
      const resposta = await fetch('http://localhost:3000/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autor_vulgo: vulgoAutor, texto: novoPost })
      });
      if (resposta.ok) { setNovoPost(''); carregarFeed(); }
    } catch (erro) { console.error("Erro ao postar", erro); }
  }

  const abrirDetalheEvento = (evento) => { setEventoSelecionado(evento); setTelaAtual('detalhe_evento'); }
  const abrirPerfilUsuario = (vulgoClicado) => {
    setPerfilSelecionado({ vulgo: vulgoClicado });
    const rolesDoCara = eventos.filter(e => e.lista_artistas && e.lista_artistas.toUpperCase().includes(vulgoClicado.toUpperCase()));
    setEventosDoPerfil(rolesDoCara);
    setTelaAtual('perfil_usuario');
  }
  const voltarParaHome = () => { setTelaAtual('home'); setEventoSelecionado(null); setPerfilSelecionado(null); }

  const handleLoginSuccess = (usuario) => { setUsuarioLogado(usuario); localStorage.setItem('@bassgunca:user', JSON.stringify(usuario)); }
  const handleSair = () => { setUsuarioLogado(null); localStorage.removeItem('@bassgunca:user'); }

  const handleCriarEvento = async (e) => {
    e.preventDefault()
    try {
      const resposta = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEvento) 
      })
      if (resposta.ok) {
        alert("🔥 Evento adicionado ao line-up!");
        setShowModal(false);
        setNovoEvento({ titulo: '', local: '', data_hora: '', data_fim: '', tipo_evento: 'unico', generos: '', link_ingresso: '', lista_artistas: '' });
        carregarEventos();
      }
    } catch (erro) { console.error("Erro na conexão", erro); }
  }

  if (!usuarioLogado) return <Login onLogin={handleLoginSuccess} />;

  const eventosAtivos = eventos.filter(evento => new Date(evento.data_hora) > new Date());

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <img src={logoImg} alt="Logo" className="logo-img-side" />
        <nav className="menu-nav">
          <div className={`menu-item fonte-quadrada ${telaAtual === 'home' ? 'ativo' : ''}`} onClick={voltarParaHome}>HOME</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'eventos' ? 'ativo' : ''}`} onClick={() => setTelaAtual('eventos')}>EVENTOS</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'artistas' ? 'ativo' : ''}`} onClick={() => setTelaAtual('artistas')}>ARTISTAS</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'feed' ? 'ativo' : ''}`} onClick={() => setTelaAtual('feed')}>FEED</div>
        </nav>
        <div style={{ flexGrow: 1 }}></div>
        <nav className="menu-nav" style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'meus_eventos' ? 'ativo' : ''}`} onClick={() => setTelaAtual('meus_eventos')}>MEUS EVENTOS</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'meu_perfil' ? 'ativo' : ''}`} onClick={() => setTelaAtual('meu_perfil')}>MEU PERFIL</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'configuracoes' ? 'ativo' : ''}`} onClick={() => setTelaAtual('configuracoes')}>CONFIGURAÇÕES</div>
        </nav>
        <button className="btn-sair fonte-quadrada" style={{ marginTop: '20px' }} onClick={handleSair}>SAIR</button>
      </aside>

      <main className="main-content">
        <header className="dash-header">
          <div className="user-info">
            <h1 className="fonte-quadrada">SALVE, {(usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase()}!</h1>
            <p className="fonte-texto" style={{color: '#aaa'}}>Sua função: {usuarioLogado.funcoes}</p>
          </div>
          <button className="btn-destaque fonte-quadrada" onClick={() => setShowModal(true)}>+ NOVO EVENTO</button>
        </header>

        {/* 🏠 TELA HOME (PÁGINA SEPARADA) */}
        {telaAtual === 'home' && (
          <Home 
            eventosAtivos={eventosAtivos}
            abrirDetalheEvento={abrirDetalheEvento}
            handleToggleInteresse={handleToggleInteresse}
            usuarioLogado={usuarioLogado}
            handlePostarFeed={handlePostarFeed}
            novoPost={novoPost}
            setNovoPost={setNovoPost}
            feed={feed}
            abrirPerfilUsuario={abrirPerfilUsuario}
          />
        )}

        {/* 🎟️ TELA EXPLORAR EVENTOS (PÁGINA SEPARADA) */}
        {telaAtual === 'eventos' && (
          <ListaEventos 
            eventos={eventos} 
            abrirDetalheEvento={abrirDetalheEvento}
            handleToggleInteresse={handleToggleInteresse}
            usuarioLogado={usuarioLogado}
          />
        )}

        {/* 🚦 OUTRAS TELAS */}
        {telaAtual === 'detalhe_evento' && <DetalheEvento evento={eventoSelecionado} onVoltar={voltarParaHome} />}
        {telaAtual === 'perfil_usuario' && <PerfilUsuario perfil={perfilSelecionado} eventosDoPerfil={eventosDoPerfil} onVoltar={voltarParaHome} />}

        {/* PLACEHOLDERS PARA TELAS FUTURAS */}
        {['artistas', 'meus_eventos', 'meu_perfil', 'configuracoes'].includes(telaAtual) && (
          <div style={{ padding: '30px', color: '#fff' }}>
            <h1 className="fonte-quadrada" style={{ color: '#ff003c', fontSize: '2.5rem' }}>{telaAtual.replace('_', ' ').toUpperCase()}</h1>
            <p className="fonte-texto" style={{ color: '#aaa', marginTop: '10px' }}>Em breve: Novas funcionalidades para a cena.</p>
          </div>
        )}
      </main> 

      {/* MODAL DE CRIAÇÃO (FICA NO APP POR SER GLOBAL) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="fonte-quadrada" style={{marginBottom: '20px', color: '#fff'}}>CRIAR EVENTO</h2>
            <form onSubmit={handleCriarEvento}>
              <input type="text" placeholder="NOME DO EVENTO" className="input-bruto fonte-texto" required 
                     value={novoEvento.titulo} onChange={e => setNovoEvento({...novoEvento, titulo: e.target.value})} />
              <input type="text" placeholder="LOCAL" className="input-bruto fonte-texto" required 
                     value={novoEvento.local} onChange={e => setNovoEvento({...novoEvento, local: e.target.value})} />
              <select className="input-bruto fonte-texto" value={novoEvento.tipo_evento} 
                      onChange={e => setNovoEvento({...novoEvento, tipo_evento: e.target.value})}>
                <option value="unico">DIA ÚNICO / CLUB</option>
                <option value="festival">FESTIVAL (VÁRIOS DIAS)</option>
              </select>
              <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flex: 1}}>
                  <label className="fonte-texto" style={{color: '#aaa', fontSize: '0.7rem'}}>INÍCIO:</label>
                  <input type="datetime-local" className="input-bruto fonte-texto" required 
                         value={novoEvento.data_hora} style={{colorScheme: 'dark'}} 
                         onChange={e => setNovoEvento({...novoEvento, data_hora: e.target.value})} />
                </div>
                {novoEvento.tipo_evento === 'festival' && (
                  <div style={{flex: 1}}>
                    <label className="fonte-texto" style={{color: '#aaa', fontSize: '0.7rem'}}>TÉRMINO:</label>
                    <input type="datetime-local" className="input-bruto fonte-texto" required 
                           value={novoEvento.data_fim} style={{colorScheme: 'dark'}} 
                           onChange={e => setNovoEvento({...novoEvento, data_fim: e.target.value})} />
                  </div>
                )}
              </div>
              <input type="text" placeholder="GÊNEROS" className="input-bruto fonte-texto" 
                     value={novoEvento.generos} onChange={e => setNovoEvento({...novoEvento, generos: e.target.value})} />
              <input type="url" placeholder="LINK DO INGRESSO" className="input-bruto fonte-texto" 
                     value={novoEvento.link_ingresso} onChange={e => setNovoEvento({...novoEvento, link_ingresso: e.target.value})} />
              <textarea placeholder="LINE-UP" className="input-bruto fonte-texto" style={{ height: '80px', paddingTop: '10px' }}
                        value={novoEvento.lista_artistas} onChange={e => setNovoEvento({...novoEvento, lista_artistas: e.target.value})} />
              <div className="modal-btns" style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <button type="button" className="btn-acao fonte-quadrada" style={{background: '#333'}} onClick={() => setShowModal(false)}>CANCELAR</button>
                <button type="submit" className="btn-acao fonte-quadrada">GRAVAR EVENTO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App