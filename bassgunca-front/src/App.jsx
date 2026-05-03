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
import Notificacoes from './pages/Notificacoes'; // Import da nova tela de notificações

function App() {
  // 1. ESTADO DA SESSÃO COM VALIDADE (12 HORAS)
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const savedData = localStorage.getItem('@bassgunca:user_session'); 
    if (savedData) {
      const session = JSON.parse(savedData);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem('@bassgunca:user_session');
        return null; // Sessão expirou
      }
      session.expiresAt = Date.now() + (12 * 60 * 60 * 1000); // Renova por mais 12h
      localStorage.setItem('@bassgunca:user_session', JSON.stringify(session));
      return session.usuario;
    }
    return null;
  });

  // 2. ESTADO DAS NOTIFICAÇÕES (Começa vazio, para não aparecer no F5)
  const [notificacoes, setNotificacoes] = useState([]);

  // OUTROS ESTADOS
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
  
  // NOVA FUNÇÃO DE ABRIR PERFIL (PUXANDO DO BANCO + REGEX)
  const abrirPerfilUsuario = async (vulgoClicado) => {
    try {
      const resposta = await fetch(`http://localhost:3000/api/usuarios/buscar/${vulgoClicado}`);
      const dadosUtilizador = await resposta.json();
      
      if (resposta.ok) {
        setPerfilSelecionado(dadosUtilizador);
      } else {
        setPerfilSelecionado({ vulgo: vulgoClicado, nome: 'Artista da Cena' });
      }

      const regexPalavraExata = new RegExp(`\\b${vulgoClicado}\\b`, 'i');
      const rolesDoCara = eventos.filter(e => 
        e.lista_artistas && regexPalavraExata.test(e.lista_artistas)
      );
      
      setEventosDoPerfil(rolesDoCara);
      setTelaAtual('perfil_usuario');
    } catch (erro) {
      console.error("Erro ao carregar perfil completo:", erro);
      setPerfilSelecionado({ vulgo: vulgoClicado });
      setTelaAtual('perfil_usuario');
    }
  }

  const voltarParaHome = () => { setTelaAtual('home'); setEventoSelecionado(null); setPerfilSelecionado(null); }

  // LOGIN (COM GERAÇÃO DE SESSÃO E NOTIFICAÇÃO DE BOAS-VINDAS)
  const handleLoginSuccess = (usuario) => { 
    // 1. Prepara a sessão para o localStorage
    const session = {
      usuario: usuario,
      expiresAt: Date.now() + (12 * 60 * 60 * 1000) // 12 horas
    };
    localStorage.setItem('@bassgunca:user_session', JSON.stringify(session)); 

    // 2. Atualiza o estado das notificações com segurança (fallback 'USUÁRIO')
    const nomeExibicao = (usuario.vulgo || usuario.nome || 'USUÁRIO').toUpperCase();
    
    setNotificacoes([{ 
      id: Date.now(), 
      tipo: 'sistema', 
      lida: false, 
      texto: `SISTEMA: Salve ${nomeExibicao}! Acesso VIP confirmado.`, 
      tempo: 'Agora mesmo' 
    }]);

    // 3. 🔥 Atualiza o estado do usuário POR ÚLTIMO para garantir a troca de tela sem erro
    setUsuarioLogado(usuario); 
  };
  // LOGOUT
  const handleSair = () => { 
    setUsuarioLogado(null); 
    localStorage.removeItem('@bassgunca:user_session'); 
  }

  // CRIAR EVENTO (COM GERAÇÃO DE NOTIFICAÇÃO NO RADAR)
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
        
        // Notificação de evento criado
        setNotificacoes(prev => [{ id: Date.now(), tipo: 'radar', lida: false, texto: `SUCESSO: Seu evento "${novoEvento.titulo}" foi adicionado ao radar!`, tempo: 'Agora' }, ...prev]);
        
        setNovoEvento({ titulo: '', local: '', data_hora: '', data_fim: '', tipo_evento: 'unico', generos: '', link_ingresso: '', lista_artistas: '' });
        carregarEventos();
      }
    } catch (erro) { console.error("Erro na conexão", erro); }
  }

  if (!usuarioLogado) return <Login onLogin={handleLoginSuccess} />;

  const eventosAtivos = eventos.filter(evento => new Date(evento.data_hora) > new Date());
  const [eventoSendoEditado, setEventoSendoEditado] = useState(null);
  const handleAbrirEdicao = (evento) => {
  setEventoSendoEditado(evento);
  setShowModal(true);
};

  return (
    <div className="dashboard-container">
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
          setTelaAtual={setTelaAtual}
          notificacoes={notificacoes}
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
        {telaAtual === 'perfil_usuario' && <PerfilUsuario perfil={perfilSelecionado} eventos={eventos} usuarioLogado={usuarioLogado} onVoltar={voltarParaHome} />}

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
    eventos={eventos} // Use todos os eventos para o produtor ver o histórico
    usuarioLogado={usuarioLogado} 
    onEditar={handleAbrirEdicao}
    onExcluir={async (id) => {
       if(window.confirm("Deseja mesmo excluir este evento?")) {
         await fetch(`http://localhost:3000/api/eventos/${id}`, { method: 'DELETE' });
         carregarEventos();
       }
    }}
  />
)}

        {telaAtual === 'meu_perfil' && (
          <MeuPerfil 
            usuarioLogado={usuarioLogado} 
            setUsuarioLogado={setUsuarioLogado} 
            eventos={eventos}
          />
        )}

        {telaAtual === 'configuracoes' && (
          <Configuracoes usuarioLogado={usuarioLogado} />
        )}

        {telaAtual === 'notificacoes' && (
          <Notificacoes notificacoes={notificacoes} setNotificacoes={setNotificacoes} />
        )}
        
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
    fecharModal={() => { setShowModal(false); setEventoSendoEditado(null); }} 
    onEventoCriado={carregarEventos} 
    eventoSendoEditado={eventoSendoEditado} 
  />
)}
    </div>
  )
}

export default App;