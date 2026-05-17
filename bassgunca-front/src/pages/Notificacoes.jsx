import React from "react";

const Notificacoes = ({ notificacoes = [], setNotificacoes }) => {
  const marcarComoLidas = () => {
    setNotificacoes(notificacoes.map((n) => ({ ...n, lida: true })));
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#fff",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px dashed #333",
          paddingBottom: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            className="fonte-quadrada"
            style={{
              fontSize: "3rem",
              color: "#fff",
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            <span style={{ color: "#ff003c" }}>SYS</span>.RADAR
          </h1>
          <p
            className="fonte-texto"
            style={{
              color: "#666",
              marginTop: "5px",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Central de Alertas e Notificações
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          {naoLidas > 0 ? (
            <button
              onClick={marcarComoLidas}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff003c",
                fontFamily: "monospace",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              [ MARCAR TODAS COMO LIDAS ]
            </button>
          ) : (
            <span style={{ color: "#666", fontFamily: "monospace" }}>
              [ NENHUM ALERTA NOVO ]
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {notificacoes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            Sem sinais no radar no momento.
          </div>
        ) : (
          notificacoes.map((notif) => (
            <div
              key={notif.id}
              style={{
                background: "#0a0a0a",
                border: "1px solid",
                borderColor: notif.lida ? "#1a1a1a" : "#ff003c",
                padding: "25px",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                position: "relative",
                opacity: notif.lida ? 0.6 : 1,
                transition: "all 0.3s",
              }}
            >
              {!notif.lida && (
                <div
                  style={{
                    position: "absolute",
                    top: "25px",
                    left: 0,
                    width: "4px",
                    height: "40px",
                    background: "#ff003c",
                  }}
                ></div>
              )}
              <div
                style={{
                  fontSize: "1.5rem",
                  background: "#050505",
                  padding: "10px",
                  border: "1px solid #222",
                  minWidth: "50px",
                  textAlign: "center",
                }}
              >
                {notif.tipo === "lineup"
                  ? "🎧"
                  : notif.tipo === "radar"
                    ? "📡"
                    : "⚙️"}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  className="fonte-texto"
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    color: notif.lida ? "#888" : "#fff",
                  }}
                >
                  {notif.texto}
                </p>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "#555",
                  }}
                >
                  {notif.tempo}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notificacoes;
