import React, { useMemo, useState } from "react";
import { FaInstagram, FaSoundcloud, FaSpotify } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

import "./PerfilUsuario.css";

function PerfilUsuario({
  perfil,
  eventos = [],
  onVoltar,
  usuarioLogado,
  abrirModalEditar,
}) {
  const [abaEventos, setAbaEventos] = useState("produtor");

  // =========================
  // LOADING
  // =========================
  if (!perfil) {
    return (
      <div className="perfil-loading">
        <div className="perfil-loading-box">
          <div className="perfil-loading-dot"></div>

          <p className="fonte-texto">Localizando sinal do usuário...</p>
        </div>
      </div>
    );
  }

  // =========================
  // NORMALIZAÇÃO
  // =========================
  const vulgoPerfil = String(perfil?.vulgo || "")
    .trim()
    .toLowerCase();

  const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regexPalavraExata = new RegExp(
    `\\b${escaparRegex(vulgoPerfil)}\\b`,
    "i",
  );

  // =========================
  // EVENTOS
  // =========================

  // EVENTOS PRODUZIDOS
  const eventosProdutor = useMemo(() => {
    return eventos.filter((e) => {
      const criador = String(e?.criado_por || "")
        .trim()
        .toLowerCase();

      return criador === vulgoPerfil;
    });
  }, [eventos, vulgoPerfil]);

  // EVENTOS EM LINEUP
  const eventosLineup = useMemo(() => {
    return eventos.filter((e) => {
      const artistas = String(
        e?.lista_artistas || e?.programacao || "",
      ).toLowerCase();

      return regexPalavraExata.test(artistas);
    });
  }, [eventos, regexPalavraExata]);

  // EVENTOS COM INTERESSE
  const eventosInteressado = useMemo(() => {
    return eventos.filter((e) => {
      const interessados = String(e?.interessados || "")
        .toLowerCase()
        .split(",")
        .map((i) => i.trim());

      return interessados.includes(vulgoPerfil);
    });
  }, [eventos, vulgoPerfil]);

  // EVENTOS DA ABA
  const eventosExibidos =
    abaEventos === "produtor"
      ? eventosProdutor
      : abaEventos === "lineup"
        ? eventosLineup
        : eventosInteressado;

  // =========================
  // PERFIL PRÓPRIO
  // =========================
  const ehMeuProprioPerfil =
    String(usuarioLogado?.vulgo || "")
      .trim()
      .toLowerCase() === vulgoPerfil;

  // =========================
  // TAGS
  // =========================
  const listaFuncoes = (perfil?.funcao || perfil?.funcoes || "MEMBRO")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  // =========================
  // REDES SOCIAIS
  // =========================
  let links = {
    instagram: "",
    soundcloud: "",
    spotify: "",
    geral: "",
  };

  const rawRedes = perfil?.redes_sociais || perfil?.links || perfil?.redes;

  try {
    if (rawRedes) {
      let parsed = rawRedes;

      // JSON dentro de string
      if (typeof parsed === "string" && parsed.trim().startsWith('"')) {
        parsed = JSON.parse(parsed);
      }

      // String JSON normal
      if (typeof parsed === "string" && parsed.trim().startsWith("{")) {
        parsed = JSON.parse(parsed);
      }

      // Objeto
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

  // fallback campos separados
  links.instagram = links.instagram || perfil?.link_instagram || "";

  links.soundcloud = links.soundcloud || perfil?.link_soundcloud || "";

  links.spotify = links.spotify || perfil?.link_spotify || "";

  links.geral = links.geral || perfil?.link_geral || "";

  return (
    <div className="perfil-page">
      {/* BOTÃO VOLTAR */}
      <button onClick={onVoltar} className="perfil-back-btn fonte-quadrada">
        ← VOLTAR
      </button>

      {/* HERO */}
      <div className="perfil-hero">
        <div className="perfil-hero-overlay"></div>

        <div className="perfil-top">
          {/* FOTO */}
          <div className="perfil-avatar-wrap">
            <img
              src={perfil?.foto_perfil || "https://via.placeholder.com/300"}
              alt="Perfil"
              className="perfil-avatar"
            />

            <div className="perfil-status-ring"></div>
          </div>

          {/* INFO */}
          <div className="perfil-info">
            <span className="perfil-mini-tag fonte-quadrada">
              PERFIL DA CENA
            </span>

            <h1 className="perfil-name fonte-quadrada">
              {perfil?.vulgo || "BASSGUNÇA"}
            </h1>

            <p className="perfil-realname fonte-texto">
              {perfil?.nome || "Usuário da plataforma"}
            </p>

            {/* TAGS */}
            <div className="perfil-tags">
              {listaFuncoes.map((funcao, index) => (
                <span key={index} className="perfil-tag fonte-quadrada">
                  {funcao.toUpperCase()}
                </span>
              ))}
            </div>

            {/* BIO */}
            <p className="perfil-bio fonte-texto">
              {perfil?.bio || "Sem biografia definida."}
            </p>

            {/* REDES */}
            <div className="perfil-socials">
              {links.instagram && (
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="perfil-social"
                >
                  <FaInstagram />
                </a>
              )}

              {links.soundcloud && (
                <a
                  href={links.soundcloud}
                  target="_blank"
                  rel="noreferrer"
                  className="perfil-social"
                >
                  <FaSoundcloud />
                </a>
              )}

              {links.spotify && (
                <a
                  href={links.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="perfil-social spotify"
                >
                  <FaSpotify />
                </a>
              )}

              {links.geral && (
                <a
                  href={links.geral}
                  target="_blank"
                  rel="noreferrer"
                  className="perfil-social"
                >
                  <SiLinktree />
                </a>
              )}
            </div>
          </div>

          {/* BOTÃO EDITAR */}
          {ehMeuProprioPerfil && (
            <button
              className="perfil-edit-btn fonte-quadrada"
              onClick={abrirModalEditar}
            >
              ✦ EDITAR PERFIL
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="perfil-stats">
        <div className="perfil-stat-card">
          <span className="perfil-stat-number fonte-quadrada">
            {eventosProdutor.length}
          </span>

          <span className="perfil-stat-label fonte-texto">PRODUÇÕES</span>
        </div>

        <div className="perfil-stat-card">
          <span className="perfil-stat-number fonte-quadrada">
            {eventosLineup.length}
          </span>

          <span className="perfil-stat-label fonte-texto">LINEUPS</span>
        </div>

        <div className="perfil-stat-card">
          <span className="perfil-stat-number fonte-quadrada">
            {eventosInteressado.length}
          </span>

          <span className="perfil-stat-label fonte-texto">PRESENÇAS</span>
        </div>
      </div>

      {/* ABAS */}
      <div className="perfil-tabs">
        <button
          onClick={() => setAbaEventos("produtor")}
          className={`perfil-tab fonte-quadrada ${
            abaEventos === "produtor" ? "active" : ""
          }`}
        >
          PRODUÇÕES
        </button>

        <button
          onClick={() => setAbaEventos("lineup")}
          className={`perfil-tab fonte-quadrada ${
            abaEventos === "lineup" ? "active" : ""
          }`}
        >
          APARIÇÕES
        </button>

        <button
          onClick={() => setAbaEventos("interessado")}
          className={`perfil-tab fonte-quadrada ${
            abaEventos === "interessado" ? "active" : ""
          }`}
        >
          PRESENÇA
        </button>
      </div>

      {/* EVENTOS */}
      <div className="perfil-events-grid">
        {eventosExibidos.length === 0 ? (
          <div className="perfil-empty">
            <p className="fonte-texto">
              Nenhum evento encontrado nesta categoria.
            </p>
          </div>
        ) : (
          eventosExibidos.map((evento) => (
            <div key={evento.id} className="perfil-event-card">
              <div className="perfil-event-glow"></div>

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

export default PerfilUsuario;
