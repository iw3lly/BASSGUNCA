import React, { useState, useEffect } from "react";
import { FaInstagram, FaSoundcloud, FaSpotify } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import ModalEditarPerfil from "./ModalEditarPerfil";

const abaStyle = {
  background: "transparent",
  border: "none",
  padding: "15px 5px",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "0.2s",
  letterSpacing: "1px",
};

function MeuPerfil({ usuarioLogado, setUsuarioLogado, eventos }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [abaEventos, setAbaEventos] = useState("produtor");
  const [dadosCompletos, setDadosCompletos] = useState(usuarioLogado);

  // =========================
  // BUSCAR DADOS ATUALIZADOS
  // =========================
  useEffect(() => {
    const carregarDadosFrescos = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/api/usuarios/buscar/${encodeURIComponent(usuarioLogado?.vulgo || "")}`,
        );
        if (resposta.ok) {
          const dadosDoBanco = await resposta.json();
          setDadosCompletos(dadosDoBanco);
          if (setUsuarioLogado) setUsuarioLogado(dadosDoBanco);
        }
      } catch (erro) {
        console.error("Erro ao puxar dados:", erro);
      }
    };

    if (!modoEdicao && usuarioLogado?.vulgo) {
      carregarDadosFrescos();
    }
  }, [usuarioLogado?.vulgo, modoEdicao, setUsuarioLogado]);

  // =========================
  // TROCA DE TELA (SEM MODAL)
  // =========================
  if (modoEdicao) {
    return (
      <ModalEditarPerfil
        usuarioLogado={dadosCompletos}
        setUsuarioLogado={setUsuarioLogado}
        onFechar={() => setModoEdicao(false)}
      />
    );
  }

  // =========================
  // PARSE DE REDES SOCIAIS (BLINDADO - PASSO 1)
  // =========================
  let links = { instagram: "", soundcloud: "", spotify: "", geral: "" };
  const rawRedes = dadosCompletos?.redes_sociais;

  if (rawRedes) {
    try {
      let parsedData = rawRedes;

      // Descasca a string se o banco tiver colocado aspas duplas em volta
      if (typeof parsedData === "string" && parsedData.trim().startsWith('"')) {
        parsedData = JSON.parse(parsedData);
      }

      // Agora verifica se realmente é um JSON
      if (typeof parsedData === "string" && parsedData.trim().startsWith("{")) {
        links = { ...links, ...JSON.parse(parsedData) };
      } else if (typeof parsedData === "object") {
        links = { ...links, ...parsedData };
      } else {
        // Se for só um texto normal solto
        links.geral = rawRedes;
      }
    } catch (e) {
      console.error("Erro ao parsear redes:", e);
      links.geral = typeof rawRedes === "string" ? rawRedes : "";
    }
  }

  // =========================
  // FUNÇÕES / TAGS
  // =========================
  const funcoesStr =
    dadosCompletos?.funcoes || dadosCompletos?.funcao || "MEMBRO";
  const listaTags = funcoesStr.split(",").filter((f) => f.trim() !== "");

  const funcoesUpper = funcoesStr.toUpperCase();
  const ehProdutor =
    funcoesUpper.includes("PRODUTOR") || funcoesUpper.includes("EVENTO");

  // =========================
  // EVENTOS
  // =========================
  const meuVulgo = String(dadosCompletos?.vulgo || "")
    .trim()
    .toLowerCase();

  const eventosProdutor = (eventos || []).filter(
    (e) =>
      String(e.criado_por || "")
        .trim()
        .toLowerCase() === meuVulgo,
  );

  const eventosLineup = (eventos || []).filter((e) => {
    if (!meuVulgo) return false;
    const regex = new RegExp(`\\b${meuVulgo}\\b`, "i");
    return (
      regex.test(String(e.titulo || "")) ||
      regex.test(String(e.lista_artistas || e.programacao || ""))
    );
  });

  const eventosInteressado = (eventos || []).filter(
    (e) =>
      meuVulgo &&
      String(e.interessados || "")
        .toLowerCase()
        .includes(meuVulgo),
  );

  const eventosExibidos =
    abaEventos === "produtor"
      ? eventosProdutor
      : abaEventos === "lineup"
        ? eventosLineup
        : eventosInteressado;

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
        color: "#fff",
        paddingBottom: "100px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#050505",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid #1a1a1a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <img
            src={
              dadosCompletos?.foto_perfil || "https://via.placeholder.com/150"
            }
            alt="Perfil"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "8px",
              objectFit: "cover",
              border: "2px solid #ff003c",
            }}
          />

          <div>
            <h2
              className="fonte-quadrada"
              style={{
                fontSize: "3rem",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              {dadosCompletos?.vulgo || "SEM VULGO"}
            </h2>

            <p
              className="fonte-texto"
              style={{
                color: "#888",
                margin: "0 0 15px 0",
                fontSize: "1.1rem",
              }}
            >
              {dadosCompletos?.nome}
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              {listaTags.map((f, i) => (
                <span
                  key={i}
                  className="fonte-quadrada"
                  style={{
                    background: "#1a1a1a",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    color: "#ff003c",
                    border: "1px solid #ff003c",
                  }}
                >
                  {f.trim().toUpperCase()}
                </span>
              ))}
            </div>

            <p
              className="fonte-texto"
              style={{
                color: "#ccc",
                maxWidth: "500px",
                lineHeight: "1.5",
                marginBottom: "20px",
                fontSize: "0.95rem",
              }}
            >
              {dadosCompletos?.bio || "Sem biografia definida."}
            </p>

            {/* REDES (Com as cores restauradas) */}
            <div style={{ display: "flex", gap: "20px" }}>
              {links.instagram && (
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#888", transition: "0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ff003c")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                >
                  <FaInstagram size={26} />
                </a>
              )}
              {links.soundcloud && (
                <a
                  href={links.soundcloud}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#888", transition: "0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ff003c")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                >
                  <FaSoundcloud size={26} />
                </a>
              )}
              {links.spotify && (
                <a
                  href={links.spotify}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#888", transition: "0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#1DB954")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                >
                  <FaSpotify size={26} />
                </a>
              )}
              {links.geral && (
                <a
                  href={links.geral}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#888", transition: "0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ff003c")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                >
                  <SiLinktree size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BOTÃO */}
        <button
          onClick={() => setModoEdicao(true)}
          className="fonte-quadrada"
          style={{
            background: "transparent",
            color: "#ff003c",
            border: "1px solid #ff003c",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          EDITAR PERFIL
        </button>
      </div>

      {/* ABAS */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "40px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {["produtor", "lineup", "interessado"].map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaEventos(aba)}
            className="fonte-quadrada"
            style={{
              ...abaStyle,
              color: abaEventos === aba ? "#ff003c" : "#666",
              borderBottom:
                abaEventos === aba
                  ? "2px solid #ff003c"
                  : "2px solid transparent",
            }}
          >
            {aba.toUpperCase()} (
            {aba === "produtor"
              ? eventosProdutor.length
              : aba === "lineup"
                ? eventosLineup.length
                : eventosInteressado.length}
            )
          </button>
        ))}
      </div>

      {/* EVENTOS */}
      <div style={{ marginTop: "30px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {eventosExibidos.length === 0 ? (
            <p style={{ color: "#444" }}>Nenhum evento encontrado.</p>
          ) : (
            eventosExibidos.map((e) => (
              <div
                key={e.id}
                style={{
                  background: "#0a0a0a",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #1a1a1a",
                }}
              >
                <h4 className="fonte-quadrada" style={{ color: "#ff003c" }}>
                  {e.titulo}
                </h4>
                <p className="fonte-texto">📍 {e.local}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MeuPerfil;
