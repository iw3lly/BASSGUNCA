import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({
  logoImg,
  telaAtual,
  setTelaAtual,
  voltarParaHome,
  handleSair,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* TOPO */}
      <div className="sidebar-top">
        <div className="sidebar-header">
          <img src={logoImg} alt="Logo" className="logo-img-side" />

          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "☰" : "✕"}
          </button>
        </div>

        <div className="sidebar-status">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* MENU */}
      <nav className="menu-nav">
        <div
          className={`menu-item ${telaAtual === "home" ? "ativo" : ""}`}
          onClick={voltarParaHome}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">⌂</span>
          <span className="menu-text fonte-quadrada">HOME</span>
        </div>

        <div
          className={`menu-item ${telaAtual === "eventos" ? "ativo" : ""}`}
          onClick={() => setTelaAtual("eventos")}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">◈</span>
          <span className="menu-text fonte-quadrada">EVENTOS</span>
        </div>

        <div
          className={`menu-item ${telaAtual === "artistas" ? "ativo" : ""}`}
          onClick={() => setTelaAtual("artistas")}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">♫</span>
          <span className="menu-text fonte-quadrada">ARTISTAS</span>
        </div>

        <div
          className={`menu-item ${telaAtual === "feed" ? "ativo" : ""}`}
          onClick={() => setTelaAtual("feed")}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">◎</span>
          <span className="menu-text fonte-quadrada">FEED</span>
        </div>
      </nav>

      <div style={{ flexGrow: 1 }}></div>

      {/* ÁREA USER */}
      <nav className="menu-nav menu-bottom">
        <div
          className={`menu-item ${telaAtual === "meus_eventos" ? "ativo" : ""}`}
          onClick={() => setTelaAtual("meus_eventos")}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">▣</span>
          <span className="menu-text fonte-quadrada">MEUS EVENTOS</span>
        </div>

        <div
          className={`menu-item ${telaAtual === "meu_perfil" ? "ativo" : ""}`}
          onClick={() => setTelaAtual("meu_perfil")}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">◉</span>
          <span className="menu-text fonte-quadrada">MEU PERFIL</span>
        </div>

        <div
          className={`menu-item ${
            telaAtual === "configuracoes" ? "ativo" : ""
          }`}
          onClick={() => setTelaAtual("configuracoes")}
        >
          <div className="menu-indicator"></div>
          <span className="menu-icon">⚙</span>
          <span className="menu-text fonte-quadrada">CONFIG</span>
        </div>
      </nav>

      {/* SAIR */}
      <button className="btn-sair fonte-quadrada" onClick={handleSair}>
        <span className="menu-icon">⤴</span>
        <span className="menu-text">SAIR</span>
      </button>
    </aside>
  );
}

export default Sidebar;
