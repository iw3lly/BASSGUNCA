import { useState, useEffect } from "react";
import "./App.css";

import logoImg from "./assets/logo.png";
import Login from "./Login";
import DetalheEvento from "./pages/DetalheEvento";
import PerfilUsuario from "./pages/PerfilUsuario";
import ListaEventos from "./pages/ListaEventos";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Artistas from "./pages/Artistas";
import ModalCriarEvento from "./components/ModalCriarEvento";
import Header from "./components/Header";
import Feed from "./components/Feed";
import MeusEventos from "./components/MeusEventos";
import MeuPerfil from "./components/MeuPerfil";
import Configuracoes from "./pages/Configuracoes";
import Notificacoes from "./pages/Notificacoes";
import { usuariosAPI, eventosAPI } from "./services/api";

// 👇 NOSSOS CUSTOM HOOKS 👇
import { useSessao } from "./hooks/useSessao";
import { useFeed } from "./hooks/useFeed";
import { useEventos } from "./hooks/useEventos";

function App() {
  // 1. INICIANDO OS HOOKS
  const { usuarioLogado, setUsuarioLogado, handleSair } = useSessao();

  const {
    feed,
    novoPost,
    setNovoPost,
    carregarFeed,
    handlePostarFeed,
    editarPostFeed,
    apagarPostFeed,
  } = useFeed(usuarioLogado);

  const {
    eventos,
    eventosAtivos,
    carregarEventos,
    handleToggleInteresse,
    apagarEvento,
    eventoSelecionado,
    setEventoSelecionado,
    eventoSendoEditado,
    setEventoSendoEditado,
  } = useEventos(usuarioLogado);

  // 2. ESTADOS DE INTERFACE (Telas, Notificações e Modais)
  const [telaAtual, setTelaAtual] = useState("home");
  const [notificacoes, setNotificacoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [eventosDoPerfil, setEventosDoPerfil] = useState([]);

  // 3. CARREGAMENTO INICIAL
  const carregarTudo = async () => {
    await Promise.all([carregarEventos(), carregarFeed()]);
  };

  useEffect(() => {
    if (usuarioLogado) {
      carregarTudo();
    }
  }, [usuarioLogado, telaAtual]); // Mantivemos a telaAtual para não precisar de F5!

  // 4. FUNÇÕES DE INTERFACE E INTEGRAÇÃO
  const handleLoginSuccess = async (usuario) => {
    const nomeExibicao = (
      usuario.vulgo ||
      usuario.nome ||
      "USUÁRIO"
    ).toUpperCase();
    setNotificacoes([
      {
        id: Date.now(),
        tipo: "sistema",
        lida: false,
        texto: `SISTEMA: Salve ${nomeExibicao}! Acesso VIP confirmado.`,
        tempo: "Agora mesmo",
      },
    ]);
    const session = {
      usuario: usuario,
      expiresAt: Date.now() + 12 * 60 * 60 * 1000,
    };
    localStorage.setItem("@bassgunca:user_session", JSON.stringify(session));
    setUsuarioLogado(usuario);
    await carregarTudo();
  };

  const abrirPerfilUsuario = async (vulgoClicado) => {
    try {
      const resposta = await usuariosAPI.buscar(vulgoClicado); // 👈 Usando a API
      const dadosUtilizador = await resposta.json();
      setPerfilSelecionado(
        resposta.ok
          ? dadosUtilizador
          : { vulgo: vulgoClicado, nome: "Artista da Cena" },
      );

      const regexPalavraExata = new RegExp(`\\b${vulgoClicado}\\b`, "i");
      setEventosDoPerfil(
        eventos.filter(
          (e) => e.lista_artistas && regexPalavraExata.test(e.lista_artistas),
        ),
      );
      setTelaAtual("perfil_usuario");
    } catch (erro) {
      setPerfilSelecionado({ vulgo: vulgoClicado });
      setTelaAtual("perfil_usuario");
    }
  };

  const voltarParaHome = () => {
    setTelaAtual("home");
    setEventoSelecionado(null);
    setPerfilSelecionado(null);
  };

  // 5. RENDERIZAÇÃO
  if (!usuarioLogado) {
    return <Login onLogin={handleLoginSuccess} />;
  }

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

        {telaAtual === "home" && (
          <Home
            eventosAtivos={eventosAtivos}
            abrirDetalheEvento={(e) => {
              setEventoSelecionado(e);
              setTelaAtual("detalhe_evento");
            }}
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

        {telaAtual === "eventos" && (
          <ListaEventos
            eventos={eventos}
            abrirDetalheEvento={(e) => {
              setEventoSelecionado(e);
              setTelaAtual("detalhe_evento");
            }}
            handleToggleInteresse={handleToggleInteresse}
            usuarioLogado={usuarioLogado}
          />
        )}

        {telaAtual === "artistas" && (
          <Artistas eventos={eventos} abrirPerfilUsuario={abrirPerfilUsuario} />
        )}

        {telaAtual === "detalhe_evento" && (
          <DetalheEvento evento={eventoSelecionado} onVoltar={voltarParaHome} />
        )}

        {telaAtual === "perfil_usuario" && (
          <PerfilUsuario
            perfil={perfilSelecionado}
            eventos={eventosDoPerfil}
            usuarioLogado={usuarioLogado}
            onVoltar={voltarParaHome}
          />
        )}

        {telaAtual === "feed" && (
          <Feed
            feed={feed}
            novoPost={novoPost}
            setNovoPost={setNovoPost}
            handlePostarFeed={handlePostarFeed}
            abrirPerfilUsuario={abrirPerfilUsuario}
            usuarioLogado={usuarioLogado}
            apagarPostFeed={apagarPostFeed}
            editarPostFeed={editarPostFeed}
          />
        )}

        {telaAtual === "meus_eventos" && (
          <MeusEventos
            eventos={eventos}
            usuarioLogado={usuarioLogado}
            onEditar={(e) => {
              setEventoSendoEditado(e);
              setShowModal(true);
            }}
            onExcluir={apagarEvento}
          />
        )}

        {telaAtual === "meu_perfil" && (
          <MeuPerfil
            usuarioLogado={usuarioLogado}
            setUsuarioLogado={setUsuarioLogado}
            eventos={eventos}
          />
        )}

        {telaAtual === "configuracoes" && (
          <Configuracoes usuarioLogado={usuarioLogado} />
        )}

        {telaAtual === "notificacoes" && (
          <Notificacoes
            notificacoes={notificacoes}
            setNotificacoes={setNotificacoes}
          />
        )}

        <Footer setTelaAtual={setTelaAtual} setShowModal={setShowModal} />
      </main>

      {showModal && (
        <ModalCriarEvento
          fecharModal={() => {
            setShowModal(false);
            setEventoSendoEditado(null);
          }}
          onEventoCriado={carregarEventos}
          eventoSendoEditado={eventoSendoEditado}
        />
      )}
    </div>
  );
}

export default App;
