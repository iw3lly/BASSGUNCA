import React from "react";
import "./Home.css";
import CardEvento from "../components/CardEvento";
import logoImg from "../assets/logo.png";

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
  const eventosPopulares = [...eventosAtivos]
    .sort((a, b) => {
      const qtdA = a.interessados ? a.interessados.split(",").length : 0;
      const qtdB = b.interessados ? b.interessados.split(",").length : 0;
      return qtdB - qtdA;
    })
    .slice(0, 3);

  return (
    <div className="home-wrapper">
      {/* HERO */}
      <section className="hero-home">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <img src={logoImg} alt="Bassgunça" className="hero-logo" />

          <p className="hero-subtitle fonte-texto">
            A plataforma da cena underground.
            <br />
            Descubra eventos, artistas e a comunidade.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-btn-primary fonte-quadrada"
              onClick={() => setTelaAtual("eventos")}
            >
              VER EVENTOS
            </button>

            <button
              className="hero-btn-secondary fonte-quadrada"
              onClick={() => setTelaAtual("feed")}
            >
              ENTRAR NA CENA
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <h3>{eventosAtivos.length}+</h3>
              <span>EVENTOS</span>
            </div>

            <div className="hero-stat-card">
              <h3>{feed.length}+</h3>
              <span>POSTS</span>
            </div>

            <div className="hero-stat-card">
              <h3>24/7</h3>
              <span>UNDERGROUND</span>
            </div>
          </div>
        </div>
      </section>

      {/* EM ALTA */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-mini-title">DESTAQUES</span>

            <h2 className="section-title fonte-quadrada">🔥 EM ALTA NA CENA</h2>
          </div>

          <button
            className="section-link fonte-quadrada"
            onClick={() => setTelaAtual("eventos")}
          >
            VER TODOS →
          </button>
        </div>

        <div className="home-grid-featured">
          {eventosPopulares.map((evento) => (
            <div className="featured-card-wrapper" key={evento.id}>
              <CardEvento
                evento={evento}
                usuarioLogado={usuarioLogado}
                aoClicarTitulo={abrirDetalheEvento}
                aoClicarEstrela={handleToggleInteresse}
              />
            </div>
          ))}
        </div>
      </section>

      {/* PRÓXIMOS */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-mini-title">AGENDA</span>

            <h2 className="section-title fonte-quadrada">🗓️ PRÓXIMOS ROLÊS</h2>
          </div>
        </div>

        <div className="home-grid">
          {eventosAtivos.slice(0, 8).map((evento) => (
            <div className="event-card-wrapper" key={evento.id}>
              <CardEvento
                evento={evento}
                usuarioLogado={usuarioLogado}
                aoClicarTitulo={abrirDetalheEvento}
                aoClicarEstrela={handleToggleInteresse}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FEED */}
      <section className="community-section">
        <div className="community-container">
          <div className="community-header">
            <span className="section-mini-title">COMUNIDADE</span>

            <h2 className="community-title fonte-quadrada">
              🗣️ BASSGUNÇA COMMUNITY
            </h2>

            <p className="community-subtitle fonte-texto">
              Compartilhe ideias, divulgue afters e fortaleça a cena.
            </p>
          </div>

          <form className="community-form" onSubmit={handlePostarFeed}>
            <input
              type="text"
              placeholder="Onde vai ser o after?"
              value={novoPost}
              onChange={(e) => setNovoPost(e.target.value)}
              className="community-input fonte-texto"
            />

            <button type="submit" className="community-btn fonte-quadrada">
              POSTAR
            </button>
          </form>

          <div className="community-feed">
            {feed.slice(0, 6).map((post) => (
              <div className="community-post" key={post.id}>
                <div className="community-post-top">
                  <strong
                    className="community-user fonte-quadrada"
                    onClick={() => abrirPerfilUsuario(post.autor_vulgo)}
                  >
                    @{post.autor_vulgo}
                  </strong>

                  <span className="community-time fonte-texto">
                    {post.data_criacao
                      ? new Date(post.data_criacao).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "Agora"}
                  </span>
                </div>

                <p className="community-text fonte-texto">{post.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
