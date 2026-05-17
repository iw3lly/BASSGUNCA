import React from "react";

function CardEvento({
  evento,
  aoClicarTitulo,
  aoClicarEstrela,
  usuarioLogado,
}) {
  // Lógica para verificar se o usuário já marcou interesse
  const meuVulgo = (
    usuarioLogado?.vulgo ||
    usuarioLogado?.nome ||
    ""
  ).toUpperCase();
  const listaInteressados = evento.interessados
    ? evento.interessados.split(",")
    : [];
  const jaInteressado = listaInteressados
    .map((v) => v.trim().toUpperCase())
    .includes(meuVulgo);

  // Contador de interessados
  const qtdInteressados =
    listaInteressados.length > 0 && listaInteressados[0] !== ""
      ? listaInteressados.length
      : 0;

  // Formatação da data
  const dataObj = new Date(evento.data_hora);
  const diaMes = dataObj
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .toUpperCase();

  return (
    <div
      className="event-strip"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",
        minHeight: "200px", // 👈 Altura fixa garante o alinhamento
        height: "100%",
        backgroundColor: "#0a0a0a",
        border: "1px solid #1a1a1a",
        position: "relative",
      }}
    >
      {/* TOPO: Título e Data */}
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, paddingRight: "10px" }}>
            <h3
              className="fonte-quadrada"
              style={{
                fontSize: "1.4rem",
                cursor: "pointer",
                margin: "0",
                color: "#fff",
                display: "-webkit-box",
                WebkitLineClamp: 2, // 👈 Limita a 2 linhas e corta se for maior
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: "1.2",
              }}
              onClick={() => aoClicarTitulo(evento)}
            >
              {evento.titulo}
            </h3>
            <p
              className="fonte-texto"
              style={{ color: "#666", fontSize: "0.85rem", marginTop: "5px" }}
            >
              📍 {evento.local}
            </p>
          </div>

          <div
            className="fonte-quadrada"
            style={{ textAlign: "right", minWidth: "60px" }}
          >
            <span style={{ fontSize: "1.1rem", color: "#fff" }}>{diaMes}</span>
            {evento.tipo_evento === "festival" && (
              <span style={{ color: "#ff003c", marginLeft: "3px" }}>+</span>
            )}
          </div>
        </div>
      </div>

      {/* RODAPÉ: Tags e Interesse */}
      <div style={{ width: "100%" }}>
        {/* Contador de interessados (Visível agora) */}
        <div style={{ marginBottom: "10px" }}>
          <span
            className="fonte-texto"
            style={{ fontSize: "0.75rem", color: "#444" }}
          >
            {qtdInteressados}{" "}
            {qtdInteressados === 1 ? "INTERESSADO" : "INTERESSADOS"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span
              className="fonte-quadrada"
              style={{
                background:
                  evento.tipo_evento === "festival" ? "#ff003c" : "#222",
                padding: "4px 8px",
                fontSize: "0.7rem",
                color: "#fff",
              }}
            >
              {evento.tipo_evento === "festival" ? "FESTIVAL" : "CLUB"}
            </span>
            <span
              className="fonte-texto"
              style={{
                border: "1px solid #333",
                padding: "3px 8px",
                fontSize: "0.65rem",
                color: "#aaa",
              }}
            >
              {evento.generos}
            </span>
          </div>

          <button
            onClick={() => aoClicarEstrela(evento.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.3rem",
              color: jaInteressado ? "#ff003c" : "#333",
              transition: "0.2s",
            }}
          >
            {jaInteressado ? "★" : "☆"} {/* 👈 Estrela voltou! */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardEvento;
