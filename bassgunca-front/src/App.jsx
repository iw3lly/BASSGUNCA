import { useState, useEffect } from 'react'
import './App.css'
import logoImg from './assets/logo.png' 
import Login from './Login'
import DetalheEvento from './pages/DetalheEvento'
import PerfilUsuario from './pages/PerfilUsuario'

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const userSalvo = localStorage.getItem('@bassgunca:user')
    return userSalvo ? JSON.parse(userSalvo) : null
  }) 

  const [eventos, setEventos] = useState([])
  const [telaAtual, setTelaAtual] = useState('dashboard')
  const [feed, setFeed] = useState([
    { id: 1, autor: 'SISTEMA', texto: 'O grave começou. Bem-vindo à Bassgunça.', tempo: 'Agora' }
  ])
  const [novoPost, setNovoPost] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [novoEvento, setNovoEvento] = useState({ 
    titulo: '', 
    local: '', 
    data_hora: '', 
    data_fim: '',        
    tipo_evento: 'unico', 
    generos: '',         
    link_ingresso: '',   
    lista_artistas: ''
  })
  const handleToggleInteresse = async (idEvento) => {
    const meuVulgo = (usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase();
    try {
      const resposta = await fetch(`http://localhost:3000/api/eventos/${idEvento}/interesse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vulgo: meuVulgo })
      });
      if (resposta.ok) {
        carregarEventos(); 
      }
    } catch (erro) {
      console.error("Erro ao marcar interesse", erro);
    }
  }
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [perfilSelecionado, setPerfilSelecionado] = useState(null)
  const [eventosDoPerfil, setEventosDoPerfil] = useState([])

  const abrirDetalheEvento = (evento) => {
    setEventoSelecionado(evento)
    setTelaAtual('detalhe_evento')
  }

  const abrirPerfilUsuario = (vulgoClicado) => {
    setPerfilSelecionado({ vulgo: vulgoClicado })
    
  
    const rolesDoCara = eventos.filter(e => 
      e.lista_artistas && e.lista_artistas.toUpperCase().includes(vulgoClicado.toUpperCase())
    )
    setEventosDoPerfil(rolesDoCara)
    
    setTelaAtual('perfil_usuario')
  }

  const voltarParaDashboard = () => {
    setTelaAtual('dashboard')
    setEventoSelecionado(null)
    setPerfilSelecionado(null)
  }

  const handleLoginSuccess = (usuario) => {
    setUsuarioLogado(usuario)
    localStorage.setItem('@bassgunca:user', JSON.stringify(usuario))
  }

  const handleSair = () => {
    setUsuarioLogado(null)
    localStorage.removeItem('@bassgunca:user')
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
      
      if (resposta.ok) {
        setNovoPost(''); 
        carregarFeed();  
      }
    } catch (erro) {
      console.error("Erro ao postar", erro);
    }
  }

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

  const handleCriarEvento = async (e) => {
    e.preventDefault()
    try {
      const resposta = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEvento) 
      })

      if (resposta.ok) {
        alert("🔥 Evento adicionado ao line-up!")
        setShowModal(false) 
        setNovoEvento({ titulo: '', local: '', data_hora: '', data_fim: '', tipo_evento: 'unico', generos: '', link_ingresso: '', lista_artistas: '' }) 
        carregarEventos() 
      } else { 
        alert("Erro ao criar o evento. Verifique o console.") 
      }
    } catch (erro) { 
      console.error("Erro na conexão", erro) 
    }
  }

  if (!usuarioLogado) {
    return <Login onLogin={handleLoginSuccess} />
  }

  const eventosAtivos = eventos.filter(evento => new Date(evento.data_hora) > new Date())

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <img src={logoImg} alt="Logo" className="logo-img-side" />
        <nav className="menu-nav">
          <div className={`menu-item fonte-quadrada ${telaAtual === 'dashboard' ? 'ativo' : ''}`} onClick={voltarParaDashboard}>DASHBOARD</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'eventos' ? 'ativo' : ''}`} onClick={() => setTelaAtual('eventos')}>EVENTOS</div>
          <div className={`menu-item fonte-quadrada ${telaAtual === 'feed' ? 'ativo' : ''}`} onClick={() => setTelaAtual('feed')}>FEED</div>
        </nav>
        <button className="btn-sair fonte-quadrada" onClick={handleSair}>SAIR</button>
      </aside>

      <main className="main-content">
        <header className="dash-header">
          <div className="user-info">
            <h1 className="fonte-quadrada">SALVE, {(usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase()}!</h1>
            <p className="fonte-texto" style={{color: '#aaa'}}>Sua função: {usuarioLogado.funcoes}</p>
          </div>
          <button className="btn-destaque fonte-quadrada" onClick={() => setShowModal(true)}>+ NOVO EVENTO</button>
        </header>

        {telaAtual === 'dashboard' && (
          <div className="grid-layout">
            <section className="stats-row">
              <div className="stat-card red">
                <h2 className="fonte-quadrada">{eventosAtivos.length}</h2>
                <span className="fonte-quadrada">EVENTOS ATIVOS</span>
              </div>
              <div className="stat-card purple">
                <h2 className="fonte-quadrada">89</h2> 
                <span className="fonte-quadrada">NA CENA</span>
              </div>
            </section>

            <div className="content-split">
              <section className="events-section">
                <h2 className="section-title fonte-quadrada">PRÓXIMOS EVENTOS</h2>
                <div className="event-list">
                  {eventosAtivos.map(e => (
                    <div key={e.id} className="event-strip" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '20px'}}>
                      
                      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <div className="event-info">
                          <span 
                            className="fonte-quadrada" 
                            style={{color: '#ff003c', fontSize: '1.5rem', cursor: 'pointer', textDecoration: 'underline'}}
                            onClick={() => abrirDetalheEvento(e)}
                          >
                            {e.titulo}
                          </span>
                          
                          <small className="fonte-texto" style={{display: 'block'}}>📍 {e.local}</small>
                          {e.generos && <small className="fonte-texto" style={{color: '#666'}}>🎶 {e.generos}</small>}
                        </div>
                        
                        <span className="event-date fonte-quadrada" style={{textAlign: 'right'}}>
                          {e.tipo_evento === 'festival' && e.data_fim
                            ? `${new Date(e.data_hora).toLocaleDateString()} até ${new Date(e.data_fim).toLocaleDateString()}`
                            : new Date(e.data_hora).toLocaleDateString()
                          }
                        </span>
                      </div>

                      {e.lista_artistas && (
                        <div style={{marginTop: '10px', width: '100%'}}>
                          <p className="fonte-texto" style={{fontSize: '0.85rem', color: '#aaa'}}>
                            <strong style={{color: '#fff'}}>LINE-UP:</strong> {e.lista_artistas}
                          </p>
                        </div>
                      )}
                      <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <button 
                          onClick={() => handleToggleInteresse(e.id)}
                          style={{
                            background: 'transparent', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '1.5rem',
                            padding: '0',
                            color: e.interessados && e.interessados.includes((usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase()) ? '#ff003c' : '#444'
                          }}
                        >
                          {e.interessados && e.interessados.includes((usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase()) ? '★' : '☆'}
                        </button>
                        
                        <span className="fonte-texto" style={{color: '#aaa', fontSize: '0.85rem'}}>
                          {e.interessados && e.interessados.length > 0 
                            ? `${e.interessados.split(',').length} festeiro(s) com interesse`
                            : 'Seja o primeiro a marcar presença!'}
                        </span>
                      </div>

                      {e.link_ingresso && (
                        <a href={e.link_ingresso} target="_blank" rel="noreferrer" 
                           className="fonte-quadrada" 
                           style={{marginTop: '15px', color: '#ff003c', textDecoration: 'none', border: '1px solid #ff003c', padding: '5px 15px', fontSize: '0.8rem', display: 'inline-block'}}>
                           INGRESSOS / CORTESIA ➔
                        </a>
                      )}

                    </div>
                  ))}
                </div>
              </section>

              <section className="feed-section">
                <h2 className="section-title fonte-quadrada">O QUE TÁ ROLANDO?</h2>
                <form className="feed-input" onSubmit={handlePostarFeed}>
                  <input type="text" placeholder="Manda a visão..." className="fonte-texto" value={novoPost} onChange={e => setNovoPost(e.target.value)} />
                  <button type="submit" className="fonte-quadrada">POSTAR</button>
                </form>
                <div className="feed-list">
                  {feed.map(p => (
                    <div key={p.id} className="feed-item">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                        <strong 
                          className="fonte-quadrada" 
                          style={{color: '#ff003c', fontSize: '1.2rem', cursor: 'pointer'}}
                          onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                        >
                          {p.autor_vulgo}
                        </strong> 
                        <span className="fonte-texto" style={{fontSize: '0.75rem', color: '#666'}}>
                          {p.data_criacao ? new Date(p.data_criacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : 'Agora'}
                        </span>
                      </div>
                      <p className="fonte-texto">{p.texto}</p>
                    </div>
                  ))}
                </div>
              </section> 
            </div> 
          </div> 
        )} 
        {/* 🚦 REGRA DO DASHBOARD TERMINA AQUI */}

        {/* 🚦 TELAS NOVAS */}
        {telaAtual === 'detalhe_evento' && (
          <DetalheEvento evento={eventoSelecionado} onVoltar={voltarParaDashboard} />
        )}

        {telaAtual === 'perfil_usuario' && (
          <PerfilUsuario perfil={perfilSelecionado} eventosDoPerfil={eventosDoPerfil} onVoltar={voltarParaDashboard} />
        )}

      </main> 

      {/* MODAL DE CRIAR EVENTO */}
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

              <input type="text" placeholder="GÊNEROS (Ex: Techno, Drill, UKG)" className="input-bruto fonte-texto" 
                     value={novoEvento.generos} onChange={e => setNovoEvento({...novoEvento, generos: e.target.value})} />

              <input type="url" placeholder="LINK DO INGRESSO / CORTESIA" className="input-bruto fonte-texto" 
                     value={novoEvento.link_ingresso} onChange={e => setNovoEvento({...novoEvento, link_ingresso: e.target.value})} />

              <textarea placeholder="LINE-UP / ARTISTAS (Separe por vírgula)" className="input-bruto fonte-texto" 
                        style={{ height: '80px', paddingTop: '10px' }}
                        value={novoEvento.lista_artistas} onChange={e => setNovoEvento({...novoEvento, lista_artistas: e.target.value})} />

              <div className="modal-btns" style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <button type="button" className="btn-acao fonte-quadrada" style={{background: '#333'}} 
                        onClick={() => setShowModal(false)}>CANCELAR</button>
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