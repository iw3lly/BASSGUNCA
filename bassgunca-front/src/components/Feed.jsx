import React, { useState } from "react";

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

  // =========================
  // INICIAR EDIÇÃO
  // =========================
  const iniciarEdicao = (post) => {
    setEditandoId(post.id);

    setTextoEditado(post.texto);
  };

  // =========================
  // SALVAR EDIÇÃO
  // =========================
  const salvarEdicao = async (id) => {
    if (textoEditado.trim() !== "") {
      await editarPostFeed(id, textoEditado);

      setEditandoId(null);
    }
  };

  return (
    <div
      style={{
        padding: "0 20px",
        maxWidth: "800px",
        margin: "0 auto",
        paddingBottom: "80px",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}
      <div
        style={{
          marginBottom: "40px",
          marginTop: "20px",
        }}
      >
        <h2
          className="fonte-quadrada"
          style={{
            fontSize: "2.5rem",
            color: "#fff",
            margin: 0,
          }}
        >
          🗣️ FEED DA CENA
        </h2>

        <p
          className="fonte-texto"
          style={{
            color: "#aaa",
            marginTop: "10px",
          }}
        >
          Onde é o after? Quem tem VIP? Manda a visão pra comunidade.
        </p>
      </div>

      {/* =========================
          FORM POST
      ========================= */}
      <form
        className="feed-input"
        onSubmit={handlePostarFeed}
        style={{
          marginBottom: "50px",
          display: "flex",
          gap: "15px",
          background: "#0a0a0a",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #1a1a1a",
        }}
      >
        <input
          type="text"
          placeholder="Escreve aí..."
          className="fonte-texto"
          value={novoPost}
          onChange={(e) => setNovoPost(e.target.value)}
          style={{
            flex: 1,
            padding: "15px 20px",
            fontSize: "1.1rem",
            background: "#050505",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: "8px",
            outline: "none",
          }}
        />

        <button
          type="submit"
          className="fonte-quadrada"
          style={{
            padding: "0 30px",
            background: "#ff003c",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.1rem",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#cc0030";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#ff003c";
          }}
        >
          POSTAR
        </button>
      </form>

      {/* =========================
          LISTA FEED
      ========================= */}
      <div
        className="feed-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {feed.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px 0",
              border: "1px dashed #333",
              borderRadius: "12px",
            }}
          >
            <p
              className="fonte-texto"
              style={{
                color: "#666",
                fontSize: "1.2rem",
              }}
            >
              A timeline tá vazia. Seja o primeiro a puxar o bonde!
            </p>
          </div>
        ) : (
          feed.map((p) => {
            const isDono =
              usuarioLogado &&
              (usuarioLogado.vulgo === p.autor_vulgo ||
                usuarioLogado.nome === p.autor_vulgo);

            return (
              <div
                key={`${p.id}-${p.texto}`}
                className="feed-item"
                style={{
                  background: "#050505",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "1px solid #111",
                  borderLeft: "4px solid #ff003c",
                  transition: "transform 0.2s",
                  position: "relative",
                }}
              >
                {/* =========================
                    TOPO DO POST
                ========================= */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <strong
                    className="fonte-quadrada"
                    style={{
                      color: "#fff",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                    }}
                    onClick={() => abrirPerfilUsuario(p.autor_vulgo)}
                  >
                    @{p.autor_vulgo}
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    {/* =========================
                        BOTÕES DO DONO
                    ========================= */}
                    {isDono && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {editandoId !== p.id && (
                          <button
                            onClick={() => iniciarEdicao(p)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              opacity: 0.7,
                            }}
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}

                        <button
                          onClick={() => apagarPostFeed(p.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            opacity: 0.7,
                          }}
                          title="Apagar"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    {/* =========================
                        DATA
                    ========================= */}
                    <span
                      className="fonte-texto"
                      style={{
                        fontSize: "0.85rem",
                        color: "#666",
                        textAlign: "right",
                      }}
                    >
                      {p.data_criacao
                        ? `${new Date(p.data_criacao).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                            },
                          )} às ${new Date(p.data_criacao).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}`
                        : "Agora"}

                      <br />

                      {Number(p.editado) === 1 && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#555",
                            fontStyle: "italic",
                          }}
                        >
                          (editado)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* =========================
                    MODO EDIÇÃO
                ========================= */}
                {editandoId === p.id ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <input
                      type="text"
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="fonte-texto"
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#000",
                        border: "1px solid #333",
                        color: "#fff",
                        borderRadius: "6px",
                        outline: "none",
                      }}
                      autoFocus
                    />

                    <button
                      onClick={() => salvarEdicao(p.id)}
                      style={{
                        background: "#ff003c",
                        color: "#fff",
                        border: "none",
                        padding: "0 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Salvar
                    </button>

                    <button
                      onClick={() => setEditandoId(null)}
                      style={{
                        background: "transparent",
                        color: "#666",
                        border: "1px solid #333",
                        padding: "0 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  /* =========================
                      TEXTO NORMAL
                  ========================= */
                  <p
                    className="fonte-texto"
                    style={{
                      fontSize: "1.15rem",
                      lineHeight: "1.6",
                      color: "#ddd",
                      margin: 0,
                    }}
                  >
                    {p.texto}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Feed;
