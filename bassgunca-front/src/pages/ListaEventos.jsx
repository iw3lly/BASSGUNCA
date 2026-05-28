import React, { useState } from "react";
import "./ListaEventos.css";

const ListaEventos = ({
  eventos,
  abrirDetalheEvento,
  handleToggleInteresse,
  usuarioLogado,
}) => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [abaRapida, setAbaRapida] = useState("tudo");
  const [filtroValor, setFiltroValor] = useState("todos");
  const [dataEspecifica, setDataEspecifica] = useState("");

  const eventosPreparados = (eventos || []).map((e) => {
    const valorSimulado = e.id % 3 === 0 ? 0 : e.id % 2 === 0 ? 40 : 120;

    const valorReal =
      e.valor !== undefined && e.valor !== null && e.valor !== ""
        ? Number(e.valor)
        : valorSimulado;

    const qtdInteressados = e.interessados
      ? e.interessados.split(",").filter((i) => i.trim() !== "").length
      : 0;

    return { ...e, valorExibicao: valorReal, qtdInteressados };
  });

  const hoje = new Date();
  const hojeString = `${hoje.getFullYear()}-${String(
    hoje.getMonth() + 1,
  ).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

  let eventosFiltrados = eventosPreparados.filter((e) => {
    if (!e.data_hora) return false;

    const dataEvento = new Date(e.data_hora);
    const dataEventoString = `${dataEvento.getFullYear()}-${String(
      dataEvento.getMonth() + 1,
    ).padStart(2, "0")}-${String(dataEvento.getDate()).padStart(2, "0")}`;

    // LÓGICA PARA SEPARAR EVENTOS PASSADOS DOS ATUAIS
    const isPassado = dataEventoString < hojeString;

    if (abaRapida === "passados") {
      // Se a aba for "passados", esconde o que for do futuro/hoje
      if (!isPassado) return false;
    } else {
      // Para todas as outras abas (tudo, hoje, populares), esconde os passados
      if (isPassado) return false;
    }

    const busca = filtroTexto.toLowerCase();
    const matchTexto =
      e.titulo?.toLowerCase().includes(busca) ||
      e.local?.toLowerCase().includes(busca) ||
      e.lista_artistas?.toLowerCase().includes(busca);

    if (!matchTexto) return false;
    if (abaRapida === "hoje" && dataEventoString !== hojeString) return false;
    if (dataEspecifica && dataEventoString !== dataEspecifica) return false;
    if (filtroValor === "gratis" && e.valorExibicao > 0) return false;
    if (filtroValor === "30" && e.valorExibicao > 30) return false;
    if (filtroValor === "50" && e.valorExibicao > 50) return false;
    if (filtroValor === "80" && e.valorExibicao > 80) return false;
    if (filtroValor === "100" && e.valorExibicao > 100) return false;
    if (filtroValor === "150" && e.valorExibicao > 150) return false;
    if (filtroValor === "250" && e.valorExibicao > 250) return false;
    if (filtroValor === "premium" && e.valorExibicao < 250) return false;

    return true;
  });

  if (abaRapida === "populares") {
    eventosFiltrados.sort((a, b) => b.qtdInteressados - a.qtdInteressados);
  } else if (abaRapida === "passados") {
    // Eventos passados ficam melhor ordenados do mais recente para o mais antigo
    eventosFiltrados.sort(
      (a, b) => new Date(b.data_hora) - new Date(a.data_hora),
    );
  } else {
    eventosFiltrados.sort(
      (a, b) => new Date(a.data_hora) - new Date(b.data_hora),
    );
  }

  const meuVulgo = String(usuarioLogado?.vulgo || usuarioLogado?.nome || "")
    .trim()
    .toLowerCase();

  return (
    <div className="eventos-page">
      {/* HERO */}
      <section className="hero-eventos">
        <div className="hero-content">
          <p
            style={{
              color: "#ff003c",
              fontFamily: "monospace",
              letterSpacing: "3px",
              marginBottom: "20px",
            }}
          >
            BASSGUNÇA EXPERIENCE
          </p>

          <h1
            className="fonte-quadrada"
            style={{
              fontSize: "clamp(3rem, 7vw, 7rem)",
              lineHeight: "0.95",
              margin: 0,
              marginBottom: "25px",
              color: "#fff",
            }}
          >
            EXPLORE
            <br />A MADRUGADA
          </h1>

          <p
            className="fonte-texto"
            style={{
              color: "#999",
              maxWidth: "700px",
              fontSize: "1.15rem",
              lineHeight: "1.7",
              marginBottom: "40px",
            }}
          >
            Descubra festivais, afters, rolês underground e eventos da cena bass
            em uma experiência feita pra quem vive a madrugada.
          </p>

          {/* BUSCA */}
          <input
            type="text"
            placeholder="BUSCAR EVENTOS, DJs, ARTISTAS OU LUGARES..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="search-big"
          />

          {/* FILTROS */}
          <div className="filters-glass">
            <button
              onClick={() => setAbaRapida("tudo")}
              className={`filter-pill ${abaRapida === "tudo" ? "active" : ""}`}
            >
              TODOS
            </button>

            <button
              onClick={() => setAbaRapida("hoje")}
              className={`filter-pill ${abaRapida === "hoje" ? "active" : ""}`}
            >
              🔥 HOJE
            </button>

            <button
              onClick={() => setAbaRapida("populares")}
              className={`filter-pill ${
                abaRapida === "populares" ? "active" : ""
              }`}
            >
              💥 EM ALTA
            </button>

            {/* NOVA ABA PARA EVENTOS PASSADOS */}
            <button
              onClick={() => setAbaRapida("passados")}
              className={`filter-pill ${
                abaRapida === "passados" ? "active" : ""
              }`}
            >
              ⏪ PASSADOS
            </button>

            <select
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
              className="filter-pill"
              style={{ background: "#0d0d0d" }}
            >
              <option value="todos">QUALQUER VALOR</option>
              <option value="gratis">0800 / FREE</option>
              <option value="30">ATÉ R$30</option>
              <option value="50">ATÉ R$50</option>
              <option value="80">ATÉ R$80</option>
              <option value="100">ATÉ R$100</option>
              <option value="150">ATÉ R$150</option>
              <option value="250">ATÉ R$250</option>
              <option value="premium">PREMIUM / OPEN BAR</option>
            </select>

            <input
              type="date"
              value={dataEspecifica}
              onChange={(e) => setDataEspecifica(e.target.value)}
              className="filter-pill"
              style={{ background: "#0d0d0d", color: "#fff" }}
            />
          </div>
        </div>
      </section>

      {/* GRID */}
      {eventosFiltrados.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px 20px",
          }}
        >
          <h2
            className="fonte-quadrada"
            style={{
              color: "#444",
              fontSize: "2.5rem",
            }}
          >
            NADA ENCONTRADO
          </h2>

          <p
            className="fonte-texto"
            style={{
              color: "#777",
              marginTop: "15px",
            }}
          >
            Tenta outros filtros ou muda a pesquisa.
          </p>
        </div>
      ) : (
        <div className="grid-eventos-premium">
          {eventosFiltrados.map((evento) => {
            const dataObjeto = new Date(evento.data_hora);

            const taInteressado = evento.interessados
              ? evento.interessados.toLowerCase().includes(meuVulgo)
              : false;

            return (
              <div key={evento.id} className="card-premium">
                {/* TOPO */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                  }}
                >
                  <div
                    className="badge-premium"
                    style={{
                      background:
                        evento.valorExibicao === 0
                          ? "#00ff66"
                          : "rgba(255,255,255,0.06)",

                      color: evento.valorExibicao === 0 ? "#000" : "#fff",
                    }}
                  >
                    {evento.valorExibicao === 0
                      ? "0800 FREE"
                      : `R$ ${evento.valorExibicao.toFixed(2)}`}
                  </div>

                  <span
                    style={{
                      color: abaRapida === "passados" ? "#777" : "#ff003c", // Cor difere se for evento antigo
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    {String(dataObjeto.getDate()).padStart(2, "0")}/
                    {String(dataObjeto.getMonth() + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* TITULO */}
                <h2
                  className="fonte-quadrada"
                  style={{
                    color: abaRapida === "passados" ? "#888" : "#fff", // Escurece o título para passados
                    fontSize: "2rem",
                    lineHeight: "1",
                    marginBottom: "15px",
                  }}
                >
                  {evento.titulo}
                </h2>

                {/* LOCAL */}
                <p
                  className="fonte-texto"
                  style={{
                    color: "#888",
                    marginBottom: "10px",
                  }}
                >
                  📍 {evento.local || "LOCAL SECRETO"}
                </p>

                {/* STATS */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "30px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    className="badge-premium"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "#aaa",
                    }}
                  >
                    👥 {evento.qtdInteressados} INTERESSADOS
                  </div>

                  {evento.generos && (
                    <div
                      className="badge-premium"
                      style={{
                        background:
                          abaRapida === "passados"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(255,0,60,0.12)",
                        color: abaRapida === "passados" ? "#aaa" : "#ff003c",
                      }}
                    >
                      🎵 {evento.generos}
                    </div>
                  )}
                </div>

                {/* BOTOES */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => abrirDetalheEvento(evento)}
                    className="card-button-main"
                    style={{
                      opacity: abaRapida === "passados" ? 0.7 : 1,
                    }}
                  >
                    VER EVENTO
                  </button>

                  <button
                    onClick={() => handleToggleInteresse(evento.id)}
                    className="card-button-like"
                    style={{
                      background: taInteressado ? "#ff003c" : "transparent",
                      color: taInteressado ? "#fff" : "#ff003c",
                      opacity: abaRapida === "passados" ? 0.5 : 1,
                      pointerEvents: abaRapida === "passados" ? "none" : "auto", // Desativa curtida em eventos antigos
                    }}
                  >
                    {taInteressado ? "🔥" : "♡"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListaEventos;
