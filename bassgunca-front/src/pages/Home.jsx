import React from "react";
import CardEvento from "../components/CardEvento";

function Home({
  eventosAtivos,
  abrirDetalheEvento,
  handleToggleInteresse,
  usuarioLogado,
  handlePostarFeed,
  novoPost,
  setNovoPost,
  feed,
  abrirPerfilUsuario,
  setTelaAtual,
}) {
  // 1. Lógica de popularidade: PEGA APENAS OS 3 PRIMEIROS
  const eventosPopulares = [...eventosAtivos]
    .sort((a, b) => {
      const qtdA = a.interessados ? a.interessados.split(",").length : 0;
      const qtdB = b.interessados ? b.interessados.split(",").length : 0;
      return qtdB - qtdA;
    })
    .slice(0, 3); // 👈 Travado em 3 unidades

  // 2. Grid fixo para 3 colunas
  const gridDestaqueStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 👈 Força 3 colunas lado a lado
    gap: "20px",
    marginBottom: "40px",
    width: "100%",
  };

  return (
    <div style={{ padding: "0 20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* SEÇÃO 1: EM ALTA (TOP 3) */}
      <section style={{ marginTop: "40px", marginBottom: "60px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2
              className="fonte-quadrada"
              style={{ fontSize: "2.5rem", color: "#fff", margin: 0 }}
            >
              🔥 EM ALTA
            </h2>
            <span
              className="fonte-texto"
              style={{ color: "#444", fontSize: "0.8rem", marginTop: "10px" }}
            >
              TOP 3 DA SEMANA
            </span>
          </div>
          <span
            className="fonte-quadrada"
            onClick={() => setTelaAtual("eventos")}
            style={{ color: "#ff003c", cursor: "pointer", fontSize: "1.1rem" }}
          >
            VER TUDO ➔
          </span>
        </div>

        <div className="grid-destaque-home" style={gridDestaqueStyle}>
          {eventosPopulares.map((e) => (
            <div key={`pop-${e.id}`} className="card-container-home">
              <CardEvento
                evento={e}
                usuarioLogado={usuarioLogado}
                aoClicarTitulo={abrirDetalheEvento}
                aoClicarEstrela={handleToggleInteresse}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 2: PRÓXIMOS ROLÊS */}
      <section style={{ marginBottom: "60px" }}>
        <h2
          className="fonte-quadrada"
          style={{ fontSize: "2rem", color: "#fff", marginBottom: "25px" }}
        >
          🗓️ PRÓXIMOS ROLÊS
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Aqui mostramos os eventos que não estão no TOP 3 para não repetir ou apenas os próximos da lista */}
          {eventosAtivos.slice(0, 8).map((e) => (
            <CardEvento
              key={e.id}
              evento={e}
              usuarioLogado={usuarioLogado}
              aoClicarTitulo={abrirDetalheEvento}
              aoClicarEstrela={handleToggleInteresse}
            />
          ))}
        </div>
      </section>

      {/* SEÇÃO 3: FEED / COMUNIDADE */}
      <section
        style={{
          marginTop: "60px",
          borderTop: "1px solid #222",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            className="fonte-quadrada"
            style={{
              fontSize: "2rem",
              color: "#ff003c",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            🗣️ BASSGUNÇA COMMUNITY
          </h2>

          <form
            className="feed-input"
            onSubmit={handlePostarFeed}
            style={{ marginBottom: "40px" }}
          >
            <input
              type="text"
              placeholder="Onde é o after? Manda a visão..."
              className="fonte-texto"
              value={novoPost}
              onChange={(e) => setNovoPost(e.target.value)}
              style={{
                padding: "20px",
                fontSize: "1.1rem",
                background: "#050505",
                border: "1px solid #333",
              }}
            />
            <button
              type="submit"
              className="fonte-quadrada"
              style={{ padding: "0 30px" }}
            >
              POSTAR
            </button>
          </form>

          <div
            className="feed-list"
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {feed.slice(0, 10).map((p) => (
              <div
                key={p.id}
                className="feed-item"
                style={{
                  background: "#0a0a0a",
                  padding: "25px",
                  borderLeft: "4px solid #333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "10px",
                  }}
                >
                  <strong
                    className="fonte-quadrada"
                    style={{
                      color: "#ff003c",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                    onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                  >
                    @{p.autor_vulgo}
                  </strong>
                  <span
                    className="fonte-texto"
                    style={{ fontSize: "0.85rem", color: "#666" }}
                  >
                    {p.data_criacao
                      ? new Date(p.data_criacao).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Agora"}
                  </span>
                </div>
                <p
                  className="fonte-texto"
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.5",
                    color: "#ddd",
                  }}
                >
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
