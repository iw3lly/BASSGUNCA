import { useState, useEffect } from 'react'
import './App.css'
import logoImg from './assets/logo.png' 
import Login from './Login'
import DetalheEvento from './pages/DetalheEvento'
import PerfilUsuario from './pages/PerfilUsuario'
import ListaEventos from './pages/ListaEventos'
import Home from './pages/Home'
import Footer from './components/Footer'; 
import Sidebar from './components/Sidebar';
import Artistas from './pages/Artistas';
import ModalCriarEvento from './components/ModalCriarEvento';
import Header from './components/Header';
import Feed from './components/Feed';
import MeusEventos from './components/MeusEventos';
import MeuPerfil from './components/MeuPerfil';
import Configuracoes from './pages/Configuracoes';


function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const userSalvo = localStorage.getItem('@bassgunca:user')
    return userSalvo ? JSON.parse(userSalvo) : null
  }) 

  const [eventos, setEventos] = useState([])
  const [telaAtual, setTelaAtual] = useState('home') 
  const [feed, setFeed] = useState([])
  const [novoPost, setNovoPost] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [novoEvento, setNovoEvento] = useState({ titulo: '', local: '', data_hora: '', data_fim: '', tipo_evento: 'unico', generos: '', link_ingresso: '', lista_artistas: '' })
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [perfilSelecionado, setPerfilSelecionado] = useState(null)
  const [eventosDoPerfil, setEventosDoPerfil] = useState([])

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
      {/* 👇 A SIDEBAR COMPONENTIZADA 👇 */}
      <Sidebar 
        logoImg={logoImg}
        telaAtual={telaAtual}
        setTelaAtual={setTelaAtual}
        voltarParaHome={voltarParaHome}
        handleSair={handleSair}
      />

<main className="main-content">
  
  <Header 
    usuarioLogado={usuarioLogado} 
    setShowModal={setShowModal} 
  />

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
            setTelaAtual={setTelaAtual}
          />
        )}

        {telaAtual === 'eventos' && (
          <ListaEventos 
            eventos={eventos} 
            abrirDetalheEvento={abrirDetalheEvento}
            handleToggleInteresse={handleToggleInteresse}
            usuarioLogado={usuarioLogado}
          />
        )}

        {telaAtual === 'artistas' && (
  <Artistas 
    eventos={eventos} 
    abrirPerfilUsuario={abrirPerfilUsuario} 
  />
)}
        
        {telaAtual === 'detalhe_evento' && <DetalheEvento evento={eventoSelecionado} onVoltar={voltarParaHome} />}
        {telaAtual === 'perfil_usuario' && <PerfilUsuario perfil={perfilSelecionado} eventosDoPerfil={eventosDoPerfil} onVoltar={voltarParaHome} />}

        {telaAtual === 'feed' && (
    <Feed 
      feed={feed}
      novoPost={novoPost}
      setNovoPost={setNovoPost}
      handlePostarFeed={handlePostarFeed}
      abrirPerfilUsuario={abrirPerfilUsuario}
    />
  )}


{telaAtual === 'meus_eventos' && (
  <MeusEventos 
    eventos={eventosAtivos} 
    usuarioLogado={usuarioLogado} 
    setEventos={setEventos}
  />
)}

{telaAtual === 'meu_perfil' && (
  <MeuPerfil 
    usuarioLogado={usuarioLogado} 
    setUsuarioLogado={setUsuarioLogado} 
    eventos={eventos}
  />
)}

        
        {/* PLACEHOLDERS APENAS UMA VEZ */}
        {[''].includes(telaAtual) && (
          <div style={{ padding: '30px', color: '#fff' }}>
            <h1 className="fonte-quadrada" style={{ color: '#ff003c', fontSize: '2.5rem' }}>{telaAtual.replace('_', ' ').toUpperCase()}</h1>
            <p className="fonte-texto" style={{ color: '#aaa', marginTop: '10px' }}>Em breve: Novas funcionalidades para a cena.</p>
          </div>
        )}
        
        <Footer setTelaAtual={setTelaAtual} setShowModal={setShowModal} />

      </main>

    
      {showModal && (
        <ModalCriarEvento 
          fecharModal={() => setShowModal(false)} 
          onEventoCriado={() => {
            carregarEventos(); // Atualiza a lista na tela
            setTelaAtual('eventos'); // Opcional: Joga a pessoa pra tela de eventos pra ela ver o que criou
          }} 
        />
      )}
    </div>
  )
}
export default App;