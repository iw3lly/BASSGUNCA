import React from "react";
import {
  FaInstagram,
  FaGithub,
  FaHeadphones,
  FaArrowRight,
} from "react-icons/fa";

import "./Footer.css";

function Footer({ setTelaAtual, setShowModal }) {
  const linksSobre = [
    {
      nome: "O que é a Bassgunça",
      acao: () => setTelaAtual("home"),
    },
    {
      nome: "Para Artistas e DJs",
      acao: () => setTelaAtual("artistas"),
    },
    {
      nome: "Painel do Produtor",
      acao: () => setTelaAtual("meus_eventos"),
    },
  ];

  const linksCenas = [
    "Brasília (DF)",
    "Ceilândia (DF)",
    "São Paulo (SP)",
    "Belo Horizonte (MG)",
  ];

  const linksSuporte = [
    {
      nome: "Central de ajuda",
      acao: () => setTelaAtual("configuracoes"),
    },
    {
      nome: "Minha Conta",
      acao: () => setTelaAtual("configuracoes"),
    },
    {
      nome: "Notificações",
      acao: () => setTelaAtual("notificacoes"),
    },
  ];

  return (
    <footer className="footer">
      {/* Glow */}
      <div className="footer-glow"></div>

      <div className="footer-container">
        {/* HERO */}
        <div className="footer-hero">
          <div className="footer-brand">
            <span className="footer-mini fonte-quadrada">
              UNDERGROUND NETWORK
            </span>

            <h1 className="footer-logo fonte-quadrada">
              BASS<span>GUNÇA</span>
            </h1>

            <p className="footer-description fonte-texto">
              Plataforma underground para DJs, produtores, coletivos e amantes
              da cena bass.
            </p>

            <button
              className="footer-cta fonte-quadrada"
              onClick={() => setShowModal(true)}
            >
              PROMOVER EVENTO
              <FaArrowRight />
            </button>
          </div>

          {/* CARDS */}
          <div className="footer-highlight-grid">
            <div className="footer-highlight-card">
              <span className="fonte-quadrada">EVENTOS</span>
              <strong>{">"} Underground Clubs</strong>
            </div>

            <div className="footer-highlight-card">
              <span className="fonte-quadrada">ARTISTAS</span>
              <strong>{">"} DJs & Produtores</strong>
            </div>

            <div className="footer-highlight-card">
              <span className="fonte-quadrada">CENA</span>
              <strong>{">"} Conexões Reais</strong>
            </div>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links-grid">
          {/* SOBRE */}
          <div className="footer-column">
            <h3 className="fonte-quadrada">SOBRE</h3>

            {linksSobre.map((item, index) => (
              <button
                key={index}
                className="footer-link fonte-texto"
                onClick={item.acao}
              >
                {item.nome}
              </button>
            ))}
          </div>

          {/* CENAS */}
          <div className="footer-column">
            <h3 className="fonte-quadrada">CENAS</h3>

            {linksCenas.map((cidade, index) => (
              <button
                key={index}
                className="footer-link fonte-texto"
                onClick={() => setTelaAtual("eventos")}
              >
                {cidade}
              </button>
            ))}

            <button
              className="footer-link destaque fonte-texto"
              onClick={() => setTelaAtual("eventos")}
            >
              Ver todas →
            </button>
          </div>

          {/* SUPORTE */}
          <div className="footer-column">
            <h3 className="fonte-quadrada">SUPORTE</h3>

            {linksSuporte.map((item, index) => (
              <button
                key={index}
                className="footer-link fonte-texto"
                onClick={item.acao}
              >
                {item.nome}
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <div className="footer-copy fonte-texto">
            <p>© 2026 Bassgunça — O underground resiste.</p>

            <div className="footer-bottom-links">
              <span>Termos</span>
              <span>Privacidade</span>
              <span>Contato</span>
            </div>
          </div>

          {/* REDES */}
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/bassgunca/"
              target="_blank"
              rel="noreferrer"
              className="footer-social"
            >
              <FaInstagram />
            </a>

            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social soundcloud"
            >
              <FaHeadphones />
            </a>

            <a
              href="https://github.com/iw3lly"
              target="_blank"
              rel="noreferrer"
              className="footer-social"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
