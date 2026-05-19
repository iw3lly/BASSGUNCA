import React, { useEffect, useMemo, useState } from "react";
import { FaInstagram, FaSoundcloud, FaSpotify } from "react-icons/fa";

import { SiLinktree } from "react-icons/si";

import ModalEditarPerfil from "./ModalEditarPerfil";

import "./MeuPerfil.css";

function MeuPerfil({ usuarioLogado, setUsuarioLogado, eventos = [] }) {
  const [modoEdicao, setModoEdicao] = useState(false);

  const [abaEventos, setAbaEventos] = useState("produtor");

  const [dadosCompletos, setDadosCompletos] = useState(usuarioLogado);

  // =========================
  // CARREGAR DADOS
  // =========================
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/api/usuarios/buscar/${encodeURIComponent(
            usuarioLogado?.vulgo || "",
          )}`,
        );

        if (resposta.ok) {
          const dados = await resposta.json();

          setDadosCompletos(dados);

          if (setUsuarioLogado) {
            setUsuarioLogado(dados);
          }
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      }
    };

    if (usuarioLogado?.vulgo && !modoEdicao) {
      carregarDados();
    }
  }, [usuarioLogado, modoEdicao, setUsuarioLogado]);

  // =========================
  // NORMALIZAÇÃO
  // =========================
  const meuVulgo = String(dadosCompletos?.vulgo || "")
    .trim()
    .toLowerCase();

  const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regexPalavraExata = new RegExp(`\\b${escaparRegex(meuVulgo)}\\b`, "i");

  // =========================
  // EVENTOS
  // =========================
  const eventosProdutor = useMemo(() => {
    return eventos.filter((e) => {
      const criador = String(e?.criado_por || "")
        .trim()
        .toLowerCase();

      return criador === meuVulgo;
    });
  }, [eventos, meuVulgo]);

  const eventosLineup = useMemo(() => {
    return eventos.filter((e) => {
      const artistas = String(
        e?.lista_artistas || e?.programacao || "",
      ).toLowerCase();

      return regexPalavraExata.test(artistas);
    });
  }, [eventos, regexPalavraExata]);

  const eventosInteressado = useMemo(() => {
    return eventos.filter((e) => {
      const interessados = String(e?.interessados || "")
        .toLowerCase()
        .split(",")
        .map((i) => i.trim());

      return interessados.includes(meuVulgo);
    });
  }, [eventos, meuVulgo]);

  const eventosExibidos =
    abaEventos === "produtor"
      ? eventosProdutor
      : abaEventos === "lineup"
        ? eventosLineup
        : eventosInteressado;

  // =========================
  // TAGS
  // =========================
  const listaFuncoes = (
    dadosCompletos?.funcao ||
    dadosCompletos?.funcoes ||
    "MEMBRO"
  )
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  // =========================
  // REDES
  // =========================
  let links = {
    instagram: "",
    soundcloud: "",
    spotify: "",
    geral: "",
  };

  const rawRedes =
    dadosCompletos?.redes_sociais ||
    dadosCompletos?.links ||
    dadosCompletos?.redes;

  try {
    if (rawRedes) {
      let parsed = rawRedes;

      if (typeof parsed === "string" && parsed.trim().startsWith('"')) {
        parsed = JSON.parse(parsed);
      }

      if (typeof parsed === "string" && parsed.trim().startsWith("{")) {
        parsed = JSON.parse(parsed);
      }

      if (typeof parsed === "object") {
        links = {
          instagram: parsed.instagram || parsed.link_instagram || "",

          soundcloud: parsed.soundcloud || parsed.link_soundcloud || "",

          spotify: parsed.spotify || parsed.link_spotify || "",

          geral: parsed.geral || parsed.linktree || parsed.link_geral || "",
        };
      }
    }
  } catch (err) {
    console.error("Erro ao parsear redes:", err);
  }

  links.instagram = links.instagram || dadosCompletos?.link_instagram || "";

  links.soundcloud = links.soundcloud || dadosCompletos?.link_soundcloud || "";

  links.spotify = links.spotify || dadosCompletos?.link_spotify || "";

  links.geral = links.geral || dadosCompletos?.link_geral || "";

  // =========================
  // PAGE EDITAR
  // =========================
  if (modoEdicao) {
    return (
      <ModalEditarPerfil
        usuarioLogado={dadosCompletos}
        setUsuarioLogado={(novoUsuario) => {
          setDadosCompletos(novoUsuario);

          if (setUsuarioLogado) {
            setUsuarioLogado(novoUsuario);
          }
        }}
        voltar={() => setModoEdicao(false)}
        onVoltar={() => setModoEdicao(false)}
        onFechar={() => setModoEdicao(false)}
      />
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="meu-perfil-page">
      {/* HERO */}
      <div className="meu-perfil-hero">
        <div className="meu-perfil-overlay"></div>

        <div className="meu-perfil-top">
          {/* FOTO */}
          <div className="meuperfil-avatar-wrap">
            <img
              src={
                dadosCompletos?.foto_perfil || "https://via.placeholder.com/300"
              }
              alt="Perfil"
              className="meuperfil-avatar"
            />

            <div className="meuperfil-status-ring"></div>

            <div className="meu-perfil-ring"></div>
          </div>

          {/* INFO */}
          <div className="meu-perfil-info">
            <span className="meu-perfil-mini-tag fonte-quadrada">
              SEU PERFIL
            </span>

            <h1 className="meu-perfil-name fonte-quadrada">
              {dadosCompletos?.vulgo || "SEM VULGO"}
            </h1>

            <p className="meu-perfil-realname fonte-texto">
              {dadosCompletos?.nome || "Usuário"}
            </p>

            {/* TAGS */}
            <div className="meu-perfil-tags">
              {listaFuncoes.map((funcao, index) => (
                <span key={index} className="meu-perfil-tag fonte-quadrada">
                  {funcao.toUpperCase()}
                </span>
              ))}
            </div>

            {/* BIO */}
            <p className="meu-perfil-bio fonte-texto">
              {dadosCompletos?.bio || "Sem biografia definida."}
            </p>

            {/* REDES */}
            <div className="meu-perfil-socials">
              {links.instagram && (
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="meu-perfil-social"
                >
                  <FaInstagram />
                </a>
              )}

              {links.soundcloud && (
                <a
                  href={links.soundcloud}
                  target="_blank"
                  rel="noreferrer"
                  className="meu-perfil-social"
                >
                  <FaSoundcloud />
                </a>
              )}

              {links.spotify && (
                <a
                  href={links.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="meu-perfil-social spotify"
                >
                  <FaSpotify />
                </a>
              )}

              {links.geral && (
                <a
                  href={links.geral}
                  target="_blank"
                  rel="noreferrer"
                  className="meu-perfil-social"
                >
                  <SiLinktree />
                </a>
              )}
            </div>
          </div>

          {/* BOTÃO */}
          <button
            className="meu-perfil-edit-btn fonte-quadrada"
            onClick={() => setModoEdicao(true)}
          >
            ✦ EDITAR PERFIL
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="meu-perfil-stats">
        <div className="meu-perfil-stat-card">
          <span className="meu-perfil-stat-number fonte-quadrada">
            {eventosProdutor.length}
          </span>

          <span className="meu-perfil-stat-label fonte-texto">PRODUÇÕES</span>
        </div>

        <div className="meu-perfil-stat-card">
          <span className="meu-perfil-stat-number fonte-quadrada">
            {eventosLineup.length}
          </span>

          <span className="meu-perfil-stat-label fonte-texto">LINEUPS</span>
        </div>

        <div className="meu-perfil-stat-card">
          <span className="meu-perfil-stat-number fonte-quadrada">
            {eventosInteressado.length}
          </span>

          <span className="meu-perfil-stat-label fonte-texto">PRESENÇAS</span>
        </div>
      </div>

      {/* ABAS */}
      <div className="meu-perfil-tabs">
        <button
          onClick={() => setAbaEventos("produtor")}
          className={`meu-perfil-tab fonte-quadrada ${
            abaEventos === "produtor" ? "active" : ""
          }`}
        >
          PRODUÇÕES
        </button>

        <button
          onClick={() => setAbaEventos("lineup")}
          className={`meu-perfil-tab fonte-quadrada ${
            abaEventos === "lineup" ? "active" : ""
          }`}
        >
          APARIÇÕES
        </button>

        <button
          onClick={() => setAbaEventos("interessado")}
          className={`meu-perfil-tab fonte-quadrada ${
            abaEventos === "interessado" ? "active" : ""
          }`}
        >
          PRESENÇA
        </button>
      </div>

      {/* EVENTOS */}
      <div className="meu-perfil-events-grid">
        {eventosExibidos.length === 0 ? (
          <div className="meu-perfil-empty">
            <p className="fonte-texto">
              Nenhum evento encontrado nesta categoria.
            </p>
          </div>
        ) : (
          eventosExibidos.map((evento) => (
            <div key={evento.id} className="meu-perfil-event-card">
              <div className="meu-perfil-event-glow"></div>

              <h3 className="fonte-quadrada">{evento.titulo}</h3>

              <p className="fonte-texto">
                📍 {evento.local || "Local indefinido"}
              </p>

              <span className="fonte-texto">
                📅{" "}
                {evento.data_hora
                  ? new Date(evento.data_hora).toLocaleDateString("pt-BR")
                  : "Sem data"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeuPerfil;
