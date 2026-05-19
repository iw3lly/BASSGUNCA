import React, { useMemo, useState } from "react";
import "./Artistas.css";

function Artistas({ eventos, abrirPerfilUsuario }) {
  const [busca, setBusca] = useState("");

  const rankingArtistas = useMemo(() => {
    const mapaArtistas = {};

    eventos.forEach((evento) => {
      if (!evento.lista_artistas) return;

      const nomes = evento.lista_artistas
        .split(",")
        .map((nome) => nome.trim().toUpperCase());

      const hypeDoEvento =
        evento.interessados && evento.interessados.trim() !== ""
          ? evento.interessados.split(",").length
          : 0;

      nomes.forEach((nome) => {
        if (!nome) return;

        if (!mapaArtistas[nome]) {
          mapaArtistas[nome] = {
            nome,
            totalEventos: 0,
            hypeTotal: 0,
          };
        }

        mapaArtistas[nome].totalEventos += 1;
        mapaArtistas[nome].hypeTotal += hypeDoEvento;
      });
    });

    return Object.values(mapaArtistas).sort(
      (a, b) => b.hypeTotal - a.hypeTotal || b.totalEventos - a.totalEventos,
    );
  }, [eventos]);

  const artistasFiltrados = rankingArtistas.filter((artista) =>
    artista.nome.includes(busca.toUpperCase()),
  );

  const top3 = artistasFiltrados.slice(0, 3);
  const restantes = artistasFiltrados.slice(3);

  return (
    <div className="artistas-page">
      {/* HERO */}
      <section className="artistas-hero">
        <div className="artistas-hero-blur"></div>

        <div className="artistas-hero-content">
          <span className="hero-tag fonte-quadrada">UNDERGROUND RANKING</span>

          <h1 className="hero-title fonte-quadrada">
            ARTISTAS
            <br />
            DA CENA
          </h1>

          <p className="hero-subtitle fonte-texto">
            Descubra os nomes mais hypados do Bassgunça. DJs, produtores e
            artistas movimentando o underground.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{rankingArtistas.length}</strong>
              <span>ARTISTAS</span>
            </div>

            <div className="hero-stat">
              <strong>{eventos.length}</strong>
              <span>EVENTOS</span>
            </div>
          </div>
        </div>

        {/* BUSCA */}
        <div className="artistas-search-wrapper">
          <input
            type="text"
            placeholder="BUSCAR ARTISTA..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="artistas-search fonte-quadrada"
          />
        </div>
      </section>

      {/* TOP 3 */}
      {!busca && top3.length > 0 && (
        <section className="top3-section">
          <div className="section-header">
            <h2 className="fonte-quadrada">TOP RANKING</h2>
            <span className="fonte-texto">MAIS FORTES DA SEMANA</span>
          </div>

          <div className="top3-grid">
            {top3.map((artista, index) => {
              const medalClass =
                index === 0 ? "gold" : index === 1 ? "silver" : "bronze";

              return (
                <div
                  key={artista.nome}
                  className={`top-card ${medalClass}`}
                  onClick={() => abrirPerfilUsuario(artista.nome)}
                >
                  <div className="top-rank">#{index + 1}</div>

                  <div className="top-avatar">{artista.nome.charAt(0)}</div>

                  <h3 className="fonte-quadrada">{artista.nome}</h3>

                  <div className="top-info">
                    <span>🔥 {artista.hypeTotal} hype</span>

                    <span>🎵 {artista.totalEventos} eventos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="artists-grid-section">
        <div className="section-header">
          <h2 className="fonte-quadrada">TODOS OS ARTISTAS</h2>

          <span className="fonte-texto">
            {artistasFiltrados.length} encontrados
          </span>
        </div>

        {artistasFiltrados.length === 0 ? (
          <div className="empty-artists">
            <h3 className="fonte-quadrada">NADA ENCONTRADO</h3>

            <p className="fonte-texto">Tente outro nome.</p>
          </div>
        ) : (
          <div className="artists-grid">
            {(busca ? artistasFiltrados : restantes).map((artista) => (
              <div
                key={artista.nome}
                className="artist-card"
                onClick={() => abrirPerfilUsuario(artista.nome)}
              >
                <div className="artist-avatar">{artista.nome.charAt(0)}</div>

                <div className="artist-content">
                  <h3 className="fonte-quadrada">{artista.nome}</h3>

                  <div className="artist-meta">
                    <span>🔥 {artista.hypeTotal} hype</span>

                    <span>•</span>

                    <span>{artista.totalEventos} eventos</span>
                  </div>
                </div>

                <div className="artist-arrow">↗</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Artistas;
