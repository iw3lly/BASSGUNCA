import { useState, useEffect } from "react";
import "./App.css";

import logoImg from "./assets/logo.png";

import Login from "./Login";

import Home from "./pages/Home";
import ListaEventos from "./pages/ListaEventos";
import DetalheEvento from "./pages/DetalheEvento";
import PerfilUsuario from "./pages/PerfilUsuario";
import Configuracoes from "./pages/Configuracoes";
import Notificacoes from "./pages/Notificacoes";
import Artistas from "./pages/Artistas";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Feed from "./components/Feed";
import MeusEventos from "./components/MeusEventos";
import MeuPerfil from "./components/MeuPerfil";
import ModalCriarEvento from "./components/ModalCriarEvento";
import ModalEditarPerfil from "./components/ModalEditarPerfil";

import { usuariosAPI } from "./services/api";

import "./styles/GlobalBackground.css";

import { useSessao } from "./hooks/useSessao";
import { useFeed } from "./hooks/useFeed";
import { useEventos } from "./hooks/useEventos";

function App() {
  // =========================================
  // SESSÃO
  // =========================================
  const { usuarioLogado, setUsuarioLogado, handleSair } = useSessao();

  // =========================================
  // FEED
  // =========================================
  const {
    feed,
    novoPost,
    setNovoPost,
    carregarFeed,
    handlePostarFeed,
    editarPostFeed,
    apagarPostFeed,
  } = useFeed(usuarioLogado);

  // =========================================
  // EVENTOS
  // =========================================
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

  // =========================================
  // INTERFACE
  // =========================================
  const [telaAtual, setTelaAtual] = useState("home");

  const [historicoTelas, setHistoricoTelas] = useState([]);

  const [notificacoes, setNotificacoes] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  const [eventosDoPerfil, setEventosDoPerfil] = useState([]);

  // =========================================
  // CARREGAMENTO
  // =========================================
  const carregarTudo = async () => {
    await Promise.all([carregarEventos(), carregarFeed()]);
  };

  useEffect(() => {
    if (usuarioLogado) {
      carregarTudo();
    }
  }, [usuarioLogado]);

  // =========================================
  // SCROLL TO TOP
  // =========================================
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [telaAtual]);

  // =========================================
  // NAVEGAÇÃO
  // =========================================
  const navegarPara = (novaTela) => {
    setHistoricoTelas((prev) => [...prev, telaAtual]);

    setTelaAtual(novaTela);
  };

  const voltarPagina = () => {
    if (historicoTelas.length === 0) {
      setTelaAtual("home");
      return;
    }

    const historicoAtualizado = [...historicoTelas];

    const ultimaTela = historicoAtualizado.pop();

    setHistoricoTelas(historicoAtualizado);

    setTelaAtual(ultimaTela || "home");
  };

  // =========================================
  // LOGIN
  // =========================================
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

  // =========================================
  // PERFIL USUÁRIO
  // =========================================
  const abrirPerfilUsuario = async (vulgoClicado) => {
    try {
      const resposta = await usuariosAPI.buscar(vulgoClicado);

      const dadosUtilizador = await resposta.json();

      setPerfilSelecionado(
        resposta.ok
          ? dadosUtilizador
          : {
              vulgo: vulgoClicado,
              nome: "Artista da Cena",
            },
      );

      const regexPalavraExata = new RegExp(
        `\\b${String(vulgoClicado).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i",
      );

      setEventosDoPerfil(
        eventos.filter(
          (e) =>
            regexPalavraExata.test(e.criado_por || "") ||
            regexPalavraExata.test(e.lista_artistas || "") ||
            regexPalavraExata.test(e.interessados || ""),
        ),
      );

      navegarPara("perfil_usuario");
    } catch (erro) {
      console.error("Erro ao abrir perfil:", erro);

      setPerfilSelecionado({
        vulgo: vulgoClicado,
      });

      navegarPara("perfil_usuario");
    }
  };

  // =========================================
  // DETALHE EVENTO
  // =========================================
  const abrirDetalheEvento = (evento) => {
    setEventoSelecionado(evento);

    navegarPara("detalhe_evento");
  };

  // =========================================
  // LOADING LOGIN
  // =========================================
  if (!usuarioLogado) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  // =========================================
  // RENDER
  // =========================================
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <Sidebar
        logoImg={logoImg}
        telaAtual={telaAtual}
        setTelaAtual={navegarPara}
        voltarParaHome={() => navegarPara("home")}
        handleSair={handleSair}
      />

      {/* MAIN */}
      <main className="main-content">
        {/* HEADER */}
        <Header
          usuarioLogado={usuarioLogado}
          setShowModal={setShowModal}
          setTelaAtual={navegarPara}
          notificacoes={notificacoes}
          voltarPagina={voltarPagina}
        />

        {/* HOME */}
        {telaAtual === "home" && (
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
            setTelaAtual={navegarPara}
          />
        )}

        {/* EVENTOS */}
        {telaAtual === "eventos" && (
          <ListaEventos
            eventos={eventos}
            abrirDetalheEvento={abrirDetalheEvento}
            handleToggleInteresse={handleToggleInteresse}
            usuarioLogado={usuarioLogado}
          />
        )}

        {/* ARTISTAS */}
        {telaAtual === "artistas" && (
          <Artistas eventos={eventos} abrirPerfilUsuario={abrirPerfilUsuario} />
        )}

        {/* DETALHE EVENTO */}
        {telaAtual === "detalhe_evento" && (
          <DetalheEvento evento={eventoSelecionado} onVoltar={voltarPagina} />
        )}

        {/* PERFIL USUÁRIO */}
        {telaAtual === "perfil_usuario" && (
          <PerfilUsuario
            perfil={perfilSelecionado}
            eventos={eventosDoPerfil}
            usuarioLogado={usuarioLogado}
            onVoltar={voltarPagina}
            abrirModalEditar={() => navegarPara("editar_perfil")}
          />
        )}

        {/* FEED */}
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

        {/* MEUS EVENTOS */}
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

        {/* MEU PERFIL */}
        {telaAtual === "meu_perfil" && (
          <MeuPerfil
            usuarioLogado={usuarioLogado}
            setUsuarioLogado={setUsuarioLogado}
            eventos={eventos}
            abrirEditarPerfil={() => navegarPara("editar_perfil")}
          />
        )}

        {/* EDITAR PERFIL */}
        {telaAtual === "editar_perfil" && (
          <ModalEditarPerfil
            usuarioLogado={usuarioLogado}
            setUsuarioLogado={setUsuarioLogado}
            onFechar={() => voltarPagina()}
          />
        )}

        {/* CONFIG */}
        {telaAtual === "configuracoes" && (
          <Configuracoes usuarioLogado={usuarioLogado} />
        )}

        {/* NOTIFICAÇÕES */}
        {telaAtual === "notificacoes" && (
          <Notificacoes
            notificacoes={notificacoes}
            setNotificacoes={setNotificacoes}
          />
        )}

        {/* FOOTER */}
        <Footer setTelaAtual={navegarPara} setShowModal={setShowModal} />
      </main>

      {/* MODAL EVENTO */}
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
