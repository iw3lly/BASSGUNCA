import React, { useState, useEffect } from "react";

function Header({
  usuarioLogado,
  setShowModal,
  setTelaAtual,
  notificacoes = [],
}) {
  const [scrolled, setScrolled] = useState(false);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const funcoesStr = usuarioLogado?.funcoes || usuarioLogado?.funcao || "";
  const funcoesUpper = funcoesStr.toUpperCase();

  const ehProdutor =
    funcoesUpper.includes("PRODUTOR") || funcoesUpper.includes("EVENTO");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`header-premium ${scrolled ? "scrolled" : ""}`}>
        <div className="header-glow"></div>

        {/* ESQUERDA */}
        <div className="header-user">
          <h1 className="header-title">
            SALVE,{" "}
            <span>
              {(
                usuarioLogado?.vulgo ||
                usuarioLogado?.nome ||
                "USUÁRIO"
              ).toUpperCase()}
            </span>
          </h1>

          <p className="header-subtitle">
            {usuarioLogado?.funcoes ||
              usuarioLogado?.funcao ||
              "MEMBRO DA CENA"}
          </p>
        </div>

        {/* DIREITA */}
        <div className="header-actions">
          {/* NOTIFICAÇÕES */}
          <button
            onClick={() => setTelaAtual("notificacoes")}
            className="header-icon-btn"
          >
            <span className="icon-main">🔔</span>

            {naoLidas > 0 && (
              <span className="notification-badge">{naoLidas}</span>
            )}
          </button>

          {/* NOVO EVENTO */}
          {ehProdutor && (
            <button
              className="header-create-btn"
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              NOVO EVENTO
            </button>
          )}
        </div>
      </header>

      <style>{`
        .header-premium {
          position: sticky;
          top: 0;
          z-index: 999;

          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 18px 28px;

          backdrop-filter: blur(18px);

          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,0.92),
              rgba(0,0,0,0.75)
            );

          border-bottom: 1px solid rgba(255,255,255,0.05);

          transition: all 0.3s ease;

          overflow: hidden;
        }

        .header-premium.scrolled {
          padding: 14px 28px;

          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,0.98),
              rgba(0,0,0,0.88)
            );

          border-bottom: 1px solid rgba(255,0,60,0.1);

          box-shadow:
            0 8px 30px rgba(0,0,0,0.35);
        }

        .header-glow {
          position: absolute;

          width: 300px;
          height: 300px;

          background:
            radial-gradient(
              circle,
              rgba(255,0,60,0.12),
              transparent 70%
            );

          top: -200px;
          right: -80px;

          pointer-events: none;
        }

        .header-user {
          position: relative;
          z-index: 2;
        }

        .header-title {
          margin: 0;

          font-size: 1.8rem;
          line-height: 1;

          color: #fff;

          font-family: "Orbitron", sans-serif;
          font-weight: 800;

          transition: 0.3s ease;
        }

        .header-premium.scrolled .header-title {
          font-size: 1.5rem;
        }

        .header-title span {
          color: #ff003c;

          text-shadow:
            0 0 15px rgba(255,0,60,0.35);
        }

        .header-subtitle {
          margin-top: 6px;

          color: #777;

          font-size: 0.82rem;

          letter-spacing: 1px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 14px;

          position: relative;
          z-index: 2;
        }

        .header-icon-btn {
          position: relative;

          width: 48px;
          height: 48px;

          border-radius: 14px;

          border: 1px solid rgba(255,255,255,0.08);

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.04),
              rgba(255,255,255,0.02)
            );

          cursor: pointer;

          transition: all 0.25s ease;

          display: flex;
          align-items: center;
          justify-content: center;

          backdrop-filter: blur(10px);
        }

        .header-icon-btn:hover {
          transform: translateY(-2px);

          border-color: rgba(255,0,60,0.25);

          box-shadow:
            0 8px 20px rgba(255,0,60,0.12);
        }

        .icon-main {
          font-size: 1.2rem;
        }

        .notification-badge {
          position: absolute;

          top: -5px;
          right: -5px;

          min-width: 22px;
          height: 22px;

          padding: 0 5px;

          border-radius: 999px;

          background: #ff003c;

          color: #fff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 0.68rem;
          font-weight: bold;

          border: 2px solid #000;
        }

        .header-create-btn {
          height: 48px;

          padding: 0 18px;

          border-radius: 14px;

          border: none;

          background:
            linear-gradient(
              135deg,
              #ff003c,
              #ff3366
            );

          color: #fff;

          font-family: "Orbitron", sans-serif;
          font-size: 0.82rem;
          font-weight: 700;

          letter-spacing: 1px;

          cursor: pointer;

          display: flex;
          align-items: center;
          gap: 10px;

          transition: all 0.25s ease;

          box-shadow:
            0 10px 25px rgba(255,0,60,0.22);
        }

        .header-create-btn span {
          font-size: 1rem;
        }

        .header-create-btn:hover {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px rgba(255,0,60,0.32);
        }

        @media (max-width: 900px) {
          .header-premium {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 600px) {
          .header-premium {
            padding: 16px;
          }

          .header-title {
            font-size: 1.3rem;
          }

          .header-subtitle {
            font-size: 0.75rem;
          }

          .header-create-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

export default Header;
