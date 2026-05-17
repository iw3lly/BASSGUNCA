import React, { useState } from "react";

const labelStyle = { color: "#666", fontSize: "0.75rem", letterSpacing: "1px" };
const inputStyle = {
  width: "100%",
  padding: "12px",
  background: "#050505",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: "6px",
  marginTop: "5px",
  outline: "none",
  fontSize: "0.9rem",
};
const btnStyle = {
  background: "#ff003c",
  color: "#fff",
  border: "none",
  padding: "20px",
  borderRadius: "8px",
  fontSize: "1.1rem",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.2s",
  width: "100%",
};

function ModalEditarPerfil({ usuarioLogado, setUsuarioLogado, onFechar }) {
  // 1. ESTADO INICIAL BLINDADO
  const [editando, setEditando] = useState(() => {
    // Proteção: se o usuário não vier, retorna um objeto vazio para não quebrar a tela
    if (!usuarioLogado) return {};

    let links = { instagram: "", soundcloud: "", spotify: "", geral: "" };
    const rawRedes = usuarioLogado.redes_sociais;

    // --- DESCASTRADOR DE REDES SOCIAIS SEGURO ---
    if (rawRedes) {
      try {
        let parsedData = rawRedes;

        // Se for string com aspas extras do banco, limpa
        if (
          typeof parsedData === "string" &&
          parsedData.trim().startsWith('"')
        ) {
          parsedData = JSON.parse(parsedData);
        }

        // Se for um objeto JSON em forma de string
        if (
          typeof parsedData === "string" &&
          parsedData.trim().startsWith("{")
        ) {
          const jsonLinks = JSON.parse(parsedData);
          links = { ...links, ...jsonLinks };
        }
        // Se já vier como objeto do banco
        else if (typeof parsedData === "object" && parsedData !== null) {
          links = { ...links, ...parsedData };
        }
        // Se for apenas um link de texto antigo
        else {
          links.geral = String(rawRedes);
        }
      } catch (e) {
        console.warn(
          "Erro ao processar redes sociais, usando como link geral:",
          e,
        );
        links.geral = String(rawRedes);
      }
    }

    // --- TRATAMENTO DE DATA SEGURO ---
    // --- TRATAMENTO DE DATA SEGURO (FORÇA O FORMATO YYYY-MM-DD) ---
    let dataFormatada = "";
    const d = usuarioLogado.data_nascimento;

    if (d) {
      try {
        // Se a data vier com o 'T' (ex: 2003-03-22T00:00:00.000Z), corta e pega só a frente
        if (String(d).includes("T")) {
          dataFormatada = String(d).split("T")[0];
        }
        // Se vier com espaço (ex: 2003-03-22 00:00:00)
        else if (String(d).includes(" ")) {
          dataFormatada = String(d).split(" ")[0];
        }
        // Caso venha outro formato, força pro padrão
        else {
          const dataObj = new Date(d);
          if (!isNaN(dataObj.getTime())) {
            dataFormatada = dataObj.toISOString().split("T")[0];
          } else {
            dataFormatada = String(d);
          }
        }
      } catch (err) {
        console.warn("Formato de data não reconhecido:", d);
      }
    }

    return {
      ...usuarioLogado,
      data_nascimento: dataFormatada,
      // Garante que funcoes nunca seja undefined
      funcoes: usuarioLogado.funcoes || usuarioLogado.funcao || "",
      link_instagram: links.instagram || "",
      link_soundcloud: links.soundcloud || "",
      link_spotify: links.spotify || "",
      link_geral: links.geral || "",
    };
  });

  // ... restante do componente (handleSalvar e return)

  const handleSalvar = async (e) => {
    e.preventDefault();

    // Empacota os links para caberem na coluna "redes_sociais" do banco
    // Empacota os links
    const pacotaoDeLinks = JSON.stringify({
      instagram: editando.link_instagram,
      soundcloud: editando.link_soundcloud,
      spotify: editando.link_spotify,
      geral: editando.link_geral,
    });

    // Formata a data e previne que envie texto vazio ("") para o banco
    let dataFormatada = null;
    if (editando.data_nascimento && editando.data_nascimento.trim() !== "") {
      dataFormatada = String(editando.data_nascimento).substring(0, 10); // Envia só YYYY-MM-DD
    }

    // A PONTE DE OURO: Os nomes aqui TEM que ser exatamente o que o Node.js espera!
    const dadosParaEnviar = {
      nome: editando.nome,
      vulgo: editando.vulgo,
      bio: editando.bio,
      foto_perfil: editando.foto_perfil,
      funcao: editando.funcoes, // O estado no React é plural, mas mandamos singular pro banco!
      data_nascimento: dataFormatada, // Envia YYYY-MM-DD ou null
      redes_sociais: pacotaoDeLinks,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/usuarios/${usuarioLogado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        },
      );

      if (response.ok) {
        alert("🔥 Identidade atualizada na cena!");

        const dadosAtualizados = { ...usuarioLogado, ...dadosParaEnviar };

        // Atualiza a memória do navegador e a tela
        const sessionAntiga = JSON.parse(
          localStorage.getItem("@bassgunca:user_session"),
        );
        if (sessionAntiga) {
          sessionAntiga.usuario = dadosAtualizados;
          localStorage.setItem(
            "@bassgunca:user_session",
            JSON.stringify(sessionAntiga),
          );
        }

        if (setUsuarioLogado) setUsuarioLogado(dadosAtualizados);
        if (onFechar) onFechar();
      } else {
        alert("Erro do servidor ao salvar as alterações.");
      }
    } catch (err) {
      alert("Erro de conexão com o banco!");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#fff",
        paddingBottom: "100px",
      }}
    >
      <header
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            className="fonte-quadrada"
            style={{ fontSize: "2.5rem", margin: 0 }}
          >
            EDITAR PERFIL
          </h2>
          <p className="fonte-texto" style={{ color: "#666" }}>
            Ajuste sua identidade no Bassgunça.
          </p>
        </div>
        <button
          onClick={onFechar}
          style={{
            background: "transparent",
            color: "#888",
            border: "1px solid #333",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          CANCELAR
        </button>
      </header>

      <form
        onSubmit={handleSalvar}
        style={{ display: "flex", flexDirection: "column", gap: "30px" }}
      >
        {/* IDENTIDADE VISUAL */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "150px 1fr",
            gap: "30px",
            background: "#0a0a0a",
            padding: "30px",
            borderRadius: "12px",
            border: "1px solid #1a1a1a",
            alignItems: "center",
          }}
        >
          <img
            src={editando.foto_perfil || "https://via.placeholder.com/150"}
            alt="Preview"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "8px",
              objectFit: "cover",
              border: "2px solid #ff003c",
            }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <label className="fonte-texto" style={labelStyle}>
              URL DA FOTO DE PERFIL
              <input
                type="text"
                value={editando.foto_perfil || ""}
                onChange={(e) =>
                  setEditando({ ...editando, foto_perfil: e.target.value })
                }
                style={inputStyle}
              />
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <label className="fonte-texto" style={labelStyle}>
                NOME REAL
                <input
                  type="text"
                  value={editando.nome || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, nome: e.target.value })
                  }
                  style={inputStyle}
                />
              </label>
              <label className="fonte-texto" style={labelStyle}>
                VULGO
                <input
                  type="text"
                  value={editando.vulgo || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, vulgo: e.target.value })
                  }
                  style={inputStyle}
                />
              </label>
            </div>
          </div>
        </div>

        {/* FUNÇÕES E BIO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <label className="fonte-texto" style={labelStyle}>
              DATA DE NASCIMENTO
              <input
                type="date"
                value={editando.data_nascimento || ""}
                onChange={(e) =>
                  setEditando({ ...editando, data_nascimento: e.target.value })
                }
                style={inputStyle}
              />
            </label>
            <label className="fonte-texto" style={labelStyle}>
              BIO (SOBRE VOCÊ)
              <textarea
                value={editando.bio || ""}
                onChange={(e) =>
                  setEditando({ ...editando, bio: e.target.value })
                }
                style={{ ...inputStyle, height: "120px", resize: "none" }}
              />
            </label>
          </div>

          <div
            style={{
              background: "#0a0a0a",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #1a1a1a",
            }}
          >
            <label
              className="fonte-texto"
              style={{
                color: "#666",
                fontSize: "0.8rem",
                display: "block",
                marginBottom: "15px",
              }}
            >
              SUAS FUNÇÕES NA CENA
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {[
                "Artista",
                "Produtor",
                "Grupo/Banda",
                "Público",
                "Evento",
                "Outro",
              ].map((f) => {
                const funcoesAtuais = editando.funcoes
                  ? editando.funcoes.split(",")
                  : [];
                const selecionado = funcoesAtuais.includes(f);
                const toggle = () => {
                  const nova = selecionado
                    ? funcoesAtuais.filter((i) => i !== f)
                    : [...funcoesAtuais, f];
                  setEditando({ ...editando, funcoes: nova.join(",") });
                };
                return (
                  <div
                    key={f}
                    onClick={toggle}
                    className="fonte-quadrada"
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      background: selecionado ? "#ff003c" : "#050505",
                      border: selecionado
                        ? "1px solid #ff003c"
                        : "1px solid #333",
                    }}
                  >
                    {f.toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* REDES SOCIAIS */}
        <div
          style={{
            background: "#0a0a0a",
            padding: "30px",
            borderRadius: "12px",
            border: "1px solid #1a1a1a",
          }}
        >
          <h3
            className="fonte-quadrada"
            style={{ fontSize: "1.2rem", marginBottom: "20px" }}
          >
            LINKS E PORTFÓLIO
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <label className="fonte-texto" style={labelStyle}>
              INSTAGRAM
              <input
                type="url"
                value={editando.link_instagram || ""}
                onChange={(e) =>
                  setEditando({ ...editando, link_instagram: e.target.value })
                }
                style={inputStyle}
              />
            </label>
            <label className="fonte-texto" style={labelStyle}>
              SOUNDCLOUD
              <input
                type="url"
                value={editando.link_soundcloud || ""}
                onChange={(e) =>
                  setEditando({ ...editando, link_soundcloud: e.target.value })
                }
                style={inputStyle}
              />
            </label>
            <label className="fonte-texto" style={labelStyle}>
              SPOTIFY
              <input
                type="url"
                value={editando.link_spotify || ""}
                onChange={(e) =>
                  setEditando({ ...editando, link_spotify: e.target.value })
                }
                style={inputStyle}
              />
            </label>
            <label className="fonte-texto" style={labelStyle}>
              LINK GERAL
              <input
                type="url"
                value={editando.link_geral || ""}
                onChange={(e) =>
                  setEditando({ ...editando, link_geral: e.target.value })
                }
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        <button type="submit" className="fonte-quadrada" style={btnStyle}>
          GRAVAR IDENTIDADE
        </button>
      </form>
    </div>
  );
}

export default ModalEditarPerfil;
