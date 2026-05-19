import React, { useState } from "react";
import "./Feed.css";

function Feed({
  feed,
  novoPost,
  setNovoPost,
  handlePostarFeed,
  abrirPerfilUsuario,
  usuarioLogado,
  apagarPostFeed,
  editarPostFeed,
}) {
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");

  const iniciarEdicao = (post) => {
    setEditandoId(post.id);
    setTextoEditado(post.texto);
  };

  const salvarEdicao = async (id) => {
    if (textoEditado.trim() !== "") {
      await editarPostFeed(id, textoEditado);
      setEditandoId(null);
    }
  };

  return (
    <div className="feed-page">
      {/* HERO */}
      <section className="feed-hero">
        <div className="feed-hero-overlay"></div>

        <div className="feed-hero-content">
          <span className="feed-badge fonte-quadrada">
            ● COMUNIDADE AO VIVO
          </span>

          <h1 className="feed-title fonte-quadrada">
            FEED DA
            <span> CENA</span>
          </h1>

          <p className="feed-subtitle fonte-texto">
            After, backstage, lineup vazado, VIP, set surpresa e toda a visão da
            noite em tempo real.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="feed-create-card">
        <div className="feed-create-header">
          <div>
            <p className="feed-create-label fonte-texto">POSTANDO COMO</p>

            <h3 className="fonte-quadrada">
              @{usuarioLogado?.vulgo || usuarioLogado?.nome}
            </h3>
          </div>

          <div className="feed-live-dot"></div>
        </div>

        <form className="feed-form" onSubmit={handlePostarFeed}>
          <textarea
            placeholder="Manda a visão pra cena..."
            className="feed-textarea fonte-texto"
            value={novoPost}
            onChange={(e) => setNovoPost(e.target.value)}
            rows={4}
          />

          <div className="feed-form-footer">
            <span className="feed-tip fonte-texto">
              Seja direto. A cena tá lendo.
            </span>

            <button type="submit" className="feed-submit fonte-quadrada">
              POSTAR →
            </button>
          </div>
        </form>
      </section>

      {/* POSTS */}
      <section className="feed-posts">
        {feed.length === 0 ? (
          <div className="feed-empty">
            <h2 className="fonte-quadrada">SEM MOVIMENTO</h2>

            <p className="fonte-texto">
              Ainda não tem ninguém puxando o bonde hoje.
            </p>
          </div>
        ) : (
          feed.map((p, index) => {
            const isDono =
              usuarioLogado &&
              (usuarioLogado.vulgo === p.autor_vulgo ||
                usuarioLogado.nome === p.autor_vulgo);

            return (
              <article
                key={`${p.id}-${p.texto}`}
                className="feed-card"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {/* glow */}
                <div className="feed-card-glow"></div>

                {/* topo */}
                <div className="feed-card-top">
                  <div className="feed-user">
                    <div className="feed-avatar fonte-quadrada">
                      {p.autor_vulgo?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <h3
                        className="fonte-quadrada"
                        onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                      >
                        @{p.autor_vulgo}
                      </h3>

                      <p className="fonte-texto">
                        {p.data_criacao
                          ? `${new Date(p.data_criacao).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                              },
                            )} • ${new Date(p.data_criacao).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}`
                          : "Agora mesmo"}

                        {Number(p.editado) === 1 && " • editado"}
                      </p>
                    </div>
                  </div>

                  {isDono && (
                    <div className="feed-actions">
                      {editandoId !== p.id && (
                        <button onClick={() => iniciarEdicao(p)} title="Editar">
                          ✏️
                        </button>
                      )}

                      <button
                        onClick={() => apagarPostFeed(p.id)}
                        title="Apagar"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                {/* conteúdo */}
                {editandoId === p.id ? (
                  <div className="feed-edit-box">
                    <textarea
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="feed-edit-input fonte-texto"
                      rows={4}
                      autoFocus
                    />

                    <div className="feed-edit-actions">
                      <button
                        className="feed-save-btn fonte-quadrada"
                        onClick={() => salvarEdicao(p.id)}
                      >
                        SALVAR
                      </button>

                      <button
                        className="feed-cancel-btn fonte-quadrada"
                        onClick={() => setEditandoId(null)}
                      >
                        CANCELAR
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="feed-content fonte-texto">{p.texto}</p>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

export default Feed;
