import React from "react";

function DetalheEvento({ evento, onVoltar }) {
  let diasDoFestival = [];
  if (evento.tipo_evento === "festival" && evento.programacao) {
    try {
      diasDoFestival =
        typeof evento.programacao === "string"
          ? JSON.parse(evento.programacao)
          : evento.programacao;
    } catch (err) {
      console.error("Erro ao decifrar a programação", err);
    }
  }

  // Define a data que vai aparecer no topo (primeiro dia ou dia único)
  const dataPrincipal =
    evento.tipo_evento === "festival" && diasDoFestival.length > 0
      ? diasDoFestival[0].data
      : evento.data_hora;

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        paddingBottom: "100px",
      }}
    >
      {/* BOTÃO VOLTAR */}
      <div style={{ marginBottom: "40px" }}>
        <button
          className="fonte-quadrada"
          onClick={onVoltar}
          style={btnVoltarStyle}
        >
          ❮ VOLTAR PARA O RADAR
        </button>
      </div>

      {/* LAYOUT ESTILO SHOTGUN: INFOS NA ESQUERDA (1.2fr), IMAGEM NA DIREITA (1fr) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: evento.imagem_url ? "1.2fr 1fr" : "1fr",
          gap: "80px",
          alignItems: "start",
        }}
      >
        {/* COLUNA 1: INFORMAÇÕES (ESQUERDA) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* CABEÇALHO DO EVENTO */}
          <div>
            <h1
              className="fonte-quadrada"
              style={{
                fontSize: "3.5rem",
                color: "#fff",
                marginBottom: "10px",
                lineHeight: "1.1",
                textTransform: "uppercase",
              }}
            >
              {evento.titulo}
            </h1>
            <p
              className="fonte-texto"
              style={{ color: "#888", fontSize: "1.1rem", margin: 0 }}
            >
              Por{" "}
              <strong style={{ color: "#fff" }}>
                {evento.criado_por || "Produtor Bassgunça"}
              </strong>
            </p>
          </div>

          {/* BLOCO DE INFOS RÁPIDAS (DATA E LOCAL) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: "rgba(255,255,255,0.02)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #111",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}
            >
              <span style={{ fontSize: "1.5rem" }}>🗓️</span>
              <div>
                <p
                  className="fonte-texto"
                  style={{
                    color: "#fff",
                    margin: "0 0 5px 0",
                    fontSize: "1.1rem",
                  }}
                >
                  {evento.tipo_evento === "festival"
                    ? "Festival (Múltiplos Dias)"
                    : "Evento Único"}
                </p>
                <p
                  className="fonte-texto"
                  style={{ color: "#888", margin: 0, fontSize: "0.9rem" }}
                >
                  {evento.tipo_evento === "festival" ? "A partir de " : ""}
                  {new Date(dataPrincipal).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  às{" "}
                  {new Date(dataPrincipal).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}
            >
              <span style={{ fontSize: "1.5rem" }}>📍</span>
              <div>
                <p
                  className="fonte-texto"
                  style={{
                    color: "#fff",
                    margin: "0 0 5px 0",
                    fontSize: "1.1rem",
                  }}
                >
                  {evento.local}
                </p>
                {evento.localizacao_url && (
                  <a
                    href={evento.localizacao_url}
                    target="_blank"
                    rel="noreferrer"
                    className="fonte-texto"
                    style={{
                      color: "#ff003c",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                    }}
                  >
                    Abrir no Google Maps ➔
                  </a>
                )}
              </div>
            </div>

            {/* MOSTRAR VALOR GERAL SE TIVER */}
            {evento.valor && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "15px",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🎟️</span>
                <div>
                  <p
                    className="fonte-texto"
                    style={{
                      color: "#00ff00",
                      margin: "0 0 5px 0",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {evento.tipo_evento === "festival"
                      ? "Passaporte: "
                      : "Ingresso: "}{" "}
                    R$ {Number(evento.valor).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DESCRIÇÃO E LINE-UP */}
          <div>
            <h3
              className="fonte-quadrada"
              style={{
                color: "#fff",
                fontSize: "1.8rem",
                marginBottom: "15px",
                borderBottom: "2px solid #222",
                paddingBottom: "10px",
              }}
            >
              DESCRIÇÃO
            </h3>

            {evento.informacoes && (
              <p
                className="fonte-texto"
                style={{
                  color: "#ccc",
                  lineHeight: "1.8",
                  fontSize: "1rem",
                  whiteSpace: "pre-wrap",
                  marginBottom: "20px",
                }}
              >
                {evento.informacoes}
              </p>
            )}

            <p
              className="fonte-texto"
              style={{ color: "#aaa", lineHeight: "1.6" }}
            >
              <strong style={{ color: "#fff" }}>Line-up: </strong>{" "}
              {evento.lista_artistas}
            </p>

            {evento.generos && (
              <p
                className="fonte-texto"
                style={{
                  color: "#ff003c",
                  marginTop: "10px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                🎵 {evento.generos.toUpperCase()}
              </p>
            )}
          </div>

          {/* CRONOGRAMA DETALHADO (SÓ PARA FESTIVAIS) */}
          {evento.tipo_evento === "festival" && diasDoFestival.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <h3
                className="fonte-quadrada"
                style={{
                  color: "#ff003c",
                  fontSize: "1.5rem",
                  marginBottom: "15px",
                }}
              >
                PROGRAMAÇÃO DIÁRIA
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {diasDoFestival.map((dia, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      background: "#0a0a0a",
                      borderLeft: "3px solid #ff003c",
                      borderRadius: "0 4px 4px 0",
                    }}
                  >
                    <p
                      className="fonte-texto"
                      style={{ margin: 0, color: "#fff" }}
                    >
                      <strong>
                        DIA {index + 1} -{" "}
                        {new Date(dia.data).toLocaleDateString("pt-BR")}
                      </strong>
                    </p>
                    {dia.lineup && (
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#888",
                          fontSize: "0.9rem",
                        }}
                      >
                        {dia.lineup}
                      </p>
                    )}
                    {dia.valor && (
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#00ff00",
                          fontSize: "0.9rem",
                        }}
                      >
                        R$ {Number(dia.valor).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTÃO DE INGRESSO (FINAL DA COLUNA ESQUERDA) */}
          {evento.link_ingresso && (
            <a
              href={evento.link_ingresso}
              target="_blank"
              rel="noreferrer"
              className="fonte-quadrada"
              style={{
                display: "block",
                marginTop: "20px",
                background: "#ff003c",
                color: "#fff",
                textDecoration: "none",
                textAlign: "center",
                padding: "15px",
                borderRadius: "4px",
                fontSize: "1.5rem",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#d60033")}
              onMouseOut={(e) => (e.target.style.background = "#ff003c")}
            >
              GARANTIR INGRESSO ➔
            </a>
          )}
        </div>

        {/* COLUNA 2: FLYER (DIREITA) */}
        {evento.imagem_url && (
          <div style={{ position: "sticky", top: "40px" }}>
            <img
              src={evento.imagem_url}
              alt="Flyer do Evento"
              style={{
                width: "100%",
                borderRadius: "12px",
                border: "1px solid #222",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ESTILOS AUXILIARES
const btnVoltarStyle = {
  background: "transparent",
  border: "none",
  color: "#aaa",
  padding: "0",
  cursor: "pointer",
  fontSize: "1rem",
  letterSpacing: "1px",
  transition: "0.2s",
};

export default DetalheEvento;
