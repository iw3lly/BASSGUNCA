import React, { useMemo, useState } from "react";

function Artistas({ eventos, abrirPerfilUsuario }) {
  const [busca, setBusca] = useState("");

  // Lógica pesada: Extrair, agrupar e rankear os artistas
  const rankingArtistas = useMemo(() => {
    const mapaArtistas = {};

    eventos.forEach((evento) => {
      if (!evento.lista_artistas) return;

      // Pega os nomes, separa por vírgula e limpa os espaços
      const nomes = evento.lista_artistas
        .split(",")
        .map((nome) => nome.trim().toUpperCase());

      // Calcula o hype do evento (quantas pessoas marcaram interesse)
      const hypeDoEvento =
        evento.interessados && evento.interessados.trim() !== ""
          ? evento.interessados.split(",").length
          : 0;

      nomes.forEach((nome) => {
        if (!nome) return;

        if (!mapaArtistas[nome]) {
          mapaArtistas[nome] = { nome: nome, totalEventos: 0, hypeTotal: 0 };
        }

        mapaArtistas[nome].totalEventos += 1;
        mapaArtistas[nome].hypeTotal += hypeDoEvento;
      });
    });

    // Converte o objeto em array e ordena (Primeiro por Hype, depois por Eventos)
    return Object.values(mapaArtistas).sort(
      (a, b) => b.hypeTotal - a.hypeTotal || b.totalEventos - a.totalEventos,
    );
  }, [eventos]);

  // Filtro da barra de busca
  const artistasFiltrados = rankingArtistas.filter((artista) =>
    artista.nome.includes(busca.toUpperCase()),
  );

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header estilo Shotgun */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <h1
          className="fonte-quadrada"
          style={{
            fontSize: "3rem",
            color: "#fff",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          ARTISTAS POPULARES
        </h1>

        {/* Busca rápida */}
        <div style={{ position: "relative", width: "300px" }}>
          <span
            style={{
              position: "absolute",
              left: "15px",
              top: "10px",
              fontSize: "1rem",
            }}
          >
            🔎
          </span>
          <input
            type="text"
            placeholder="Buscar artista..."
            className="fonte-texto"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px 12px 40px",
              fontSize: "1rem",
              background: "#111",
              border: "1px solid #333",
              color: "#fff",
              outline: "none",
              borderRadius: "8px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff003c")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>
      </div>

      {/* Grid de Cards (2 colunas) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        {artistasFiltrados.map((artista, index) => {
          // Lógica da medalha para o Top 3
          let corMedalha = "";
          if (index === 0)
            corMedalha = "#ffcc00"; // Ouro
          else if (index === 1)
            corMedalha = "#c0c0c0"; // Prata
          else if (index === 2) corMedalha = "#cd7f32"; // Bronze

          return (
            <div
              key={artista.nome}
              onClick={() => abrirPerfilUsuario(artista.nome)}
              style={{
                background: "#1a1a1a",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#222";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a1a1a";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {/* Avatar Redondo (Gerado com a inicial do artista) */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff003c, #8a2be2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {artista.nome.charAt(0)}
                </div>

                {/* Badge do Top 3 */}
                {index < 3 && !busca && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: corMedalha,
                      color: "#000",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      border: "2px solid #1a1a1a",
                    }}
                  >
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Infos do Artista */}
              <div style={{ flex: 1 }}>
                <h3
                  className="fonte-quadrada"
                  style={{
                    fontSize: "1.6rem",
                    color: "#fff",
                    margin: "0 0 5px 0",
                  }}
                >
                  {artista.nome}
                </h3>
                <p
                  className="fonte-texto"
                  style={{ fontSize: "0.9rem", color: "#aaa", margin: 0 }}
                >
                  <span style={{ color: "#ff003c" }}>
                    {artista.hypeTotal} hype
                  </span>{" "}
                  • {artista.totalEventos}{" "}
                  {artista.totalEventos === 1 ? "evento" : "eventos"} no radar
                </p>
              </div>
            </div>
          );
        })}

        {artistasFiltrados.length === 0 && (
          <p
            className="fonte-texto"
            style={{
              color: "#666",
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            Nenhum artista encontrado com esse nome.
          </p>
        )}
      </div>
    </div>
  );
}

export default Artistas;
