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

import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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
      usuario,
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
  // LOGIN SCREEN
  // =========================================
  if (!usuarioLogado) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  // =========================================
  // ANIMAÇÃO
  // =========================================
  const pageAnimation = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.25 },
  };

  // =========================================
  // RENDER
  // =========================================
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0a0a0a",
            color: "#fff",
            border: "1px solid #222",
          },
        }}
      />

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

          <AnimatePresence mode="wait">
            {/* HOME */}
            {telaAtual === "home" && (
              <motion.div key="home" {...pageAnimation}>
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
              </motion.div>
            )}

            {/* EVENTOS */}
            {telaAtual === "eventos" && (
              <motion.div key="eventos" {...pageAnimation}>
                <ListaEventos
                  eventos={eventos}
                  abrirDetalheEvento={abrirDetalheEvento}
                  handleToggleInteresse={handleToggleInteresse}
                  usuarioLogado={usuarioLogado}
                />
              </motion.div>
            )}

            {/* ARTISTAS */}
            {telaAtual === "artistas" && (
              <motion.div key="artistas" {...pageAnimation}>
                <Artistas
                  eventos={eventos}
                  abrirPerfilUsuario={abrirPerfilUsuario}
                />
              </motion.div>
            )}

            {/* DETALHE EVENTO */}
            {telaAtual === "detalhe_evento" && (
              <motion.div key="detalhe_evento" {...pageAnimation}>
                <DetalheEvento
                  evento={eventoSelecionado}
                  onVoltar={voltarPagina}
                />
              </motion.div>
            )}

            {/* PERFIL USUÁRIO */}
            {telaAtual === "perfil_usuario" && (
              <motion.div key="perfil_usuario" {...pageAnimation}>
                <PerfilUsuario
                  perfil={perfilSelecionado}
                  eventos={eventosDoPerfil}
                  usuarioLogado={usuarioLogado}
                  onVoltar={voltarPagina}
                  abrirModalEditar={() => navegarPara("editar_perfil")}
                />
              </motion.div>
            )}

            {/* FEED */}
            {telaAtual === "feed" && (
              <motion.div key="feed" {...pageAnimation}>
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
              </motion.div>
            )}

            {/* MEUS EVENTOS */}
            {telaAtual === "meus_eventos" && (
              <motion.div key="meus_eventos" {...pageAnimation}>
                <MeusEventos
                  eventos={eventos}
                  usuarioLogado={usuarioLogado}
                  onEditar={(e) => {
                    setEventoSendoEditado(e);
                    setShowModal(true);
                  }}
                  onExcluir={apagarEvento}
                />
              </motion.div>
            )}

            {/* MEU PERFIL */}
            {telaAtual === "meu_perfil" && (
              <motion.div key="meu_perfil" {...pageAnimation}>
                <MeuPerfil
                  usuarioLogado={usuarioLogado}
                  setUsuarioLogado={setUsuarioLogado}
                  eventos={eventos}
                  abrirEditarPerfil={() => navegarPara("editar_perfil")}
                />
              </motion.div>
            )}

            {/* EDITAR PERFIL */}
            {telaAtual === "editar_perfil" && (
              <motion.div key="editar_perfil" {...pageAnimation}>
                <ModalEditarPerfil
                  usuarioLogado={usuarioLogado}
                  setUsuarioLogado={setUsuarioLogado}
                  onFechar={voltarPagina}
                />
              </motion.div>
            )}

            {/* CONFIG */}
            {telaAtual === "configuracoes" && (
              <motion.div key="configuracoes" {...pageAnimation}>
                <Configuracoes usuarioLogado={usuarioLogado} />
              </motion.div>
            )}

            {/* NOTIFICAÇÕES */}
            {telaAtual === "notificacoes" && (
              <motion.div key="notificacoes" {...pageAnimation}>
                <Notificacoes
                  notificacoes={notificacoes}
                  setNotificacoes={setNotificacoes}
                />
              </motion.div>
            )}
          </AnimatePresence>

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
    </>
  );
}

export default App;
