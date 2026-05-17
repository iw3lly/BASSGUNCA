import React, { useState } from "react";

function ModalCriarEvento({ fecharModal, onEventoCriado, usuarioLogado }) {
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    local: "",
    data_hora: "",
    tipo_evento: "unico",
    generos: "",
    link_ingresso: "",
    lista_artistas: "",
    valor: "",
    imagem_url: "",
    localizacao_url: "",
    programacao: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataPrincipal =
        novoEvento.tipo_evento === "festival" &&
        novoEvento.programacao.length > 0
          ? novoEvento.programacao[0].data
          : novoEvento.data_hora;

      const dadosParaEnviar = {
        ...novoEvento,
        data_hora: dataPrincipal,
        criado_por: usuarioLogado?.vulgo || usuarioLogado?.nome || "Anônimo",
      };

      const resposta = await fetch("http://localhost:3000/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (resposta.ok) {
        alert("🔥 Evento adicionado ao line-up!");
        onEventoCriado();
        fecharModal();
      } else {
        alert("Erro ao criar o evento. Verifique o terminal do servidor.");
      }
    } catch (erro) {
      console.error("Erro na conexão", erro);
    }
  };

  const adicionarDia = () => {
    setNovoEvento({
      ...novoEvento,
      programacao: [
        ...novoEvento.programacao,
        { data: "", lineup: "", valor: "" },
      ],
    });
  };

  const removerDia = (index) => {
    const filtrados = novoEvento.programacao.filter((_, i) => i !== index);
    setNovoEvento({ ...novoEvento, programacao: filtrados });
  };

  const atualizarDia = (index, campo, valor) => {
    const novosDias = [...novoEvento.programacao];
    novosDias[index][campo] = valor;
    setNovoEvento({ ...novoEvento, programacao: novosDias });
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-box"
        style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2
          className="fonte-quadrada"
          style={{ marginBottom: "20px", color: "#fff" }}
        >
          LANÇAR EVENTO
        </h2>

        <form onSubmit={handleSubmit}>
          {/* BLOCO 1: NOME, LOCAL E TIPO */}
          <input
            type="text"
            placeholder="NOME DO EVENTO"
            className="input-bruto fonte-texto"
            required
            value={novoEvento.titulo}
            onChange={(e) =>
              setNovoEvento({ ...novoEvento, titulo: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="LOCAL (EX: SUB DULCINA)"
            className="input-bruto fonte-texto"
            required
            value={novoEvento.local}
            onChange={(e) =>
              setNovoEvento({ ...novoEvento, local: e.target.value })
            }
          />

          <select
            className="input-bruto fonte-texto"
            value={novoEvento.tipo_evento}
            onChange={(e) => {
              const tipo = e.target.value;
              let prog = [...novoEvento.programacao];
              if (tipo === "festival" && prog.length === 0) {
                prog = [
                  {
                    data: novoEvento.data_hora,
                    lineup: novoEvento.lista_artistas,
                    valor: "",
                  },
                ];
              }
              setNovoEvento({
                ...novoEvento,
                tipo_evento: tipo,
                programacao: prog,
              });
            }}
          >
            <option value="unico">DIA ÚNICO / CLUB</option>
            <option value="festival">FESTIVAL (MÚLTIPLOS DIAS)</option>
          </select>

          {/* BLOCO 2: DATA (SÓ APARECE SE FOR EVENTO ÚNICO) */}
          {novoEvento.tipo_evento === "unico" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <div style={{ flex: 1 }}>
                <label
                  className="fonte-texto"
                  style={{ color: "#aaa", fontSize: "0.7rem" }}
                >
                  DATA E HORA DO ROLÊ:
                </label>
                <input
                  type="datetime-local"
                  className="input-bruto fonte-texto"
                  required
                  value={novoEvento.data_hora}
                  style={{ colorScheme: "dark" }}
                  onChange={(e) =>
                    setNovoEvento({ ...novoEvento, data_hora: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* BLOCO 3: CRONOGRAMA DO FESTIVAL */}
          {novoEvento.tipo_evento === "festival" && (
            <div
              style={{
                marginTop: "15px",
                borderTop: "1px solid #222",
                paddingTop: "15px",
                background: "#0a0a0a",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              <h4
                className="fonte-quadrada"
                style={{
                  color: "#ff003c",
                  marginBottom: "10px",
                  fontSize: "0.8rem",
                }}
              >
                DIAS DO FESTIVAL
              </h4>

              {novoEvento.programacao.map((dia, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    border: "1px dashed #333",
                    position: "relative",
                  }}
                >
                  <label
                    className="fonte-texto"
                    style={{ color: "#666", fontSize: "0.6rem" }}
                  >
                    DATA E HORA DO DIA {index + 1}:
                  </label>
                  <input
                    type="datetime-local"
                    className="input-bruto fonte-texto"
                    style={{ colorScheme: "dark" }}
                    required
                    value={dia.data}
                    onChange={(e) =>
                      atualizarDia(index, "data", e.target.value)
                    }
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <div>
                      <label
                        className="fonte-texto"
                        style={{ color: "#666", fontSize: "0.6rem" }}
                      >
                        ARTISTAS / LINE-UP:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: DJ A, DJ B"
                        className="input-bruto fonte-texto"
                        required
                        value={dia.lineup}
                        onChange={(e) =>
                          atualizarDia(index, "lineup", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label
                        className="fonte-texto"
                        style={{ color: "#666", fontSize: "0.6rem" }}
                      >
                        VALOR DIA (R$):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 40"
                        className="input-bruto fonte-texto"
                        value={dia.valor || ""}
                        onChange={(e) =>
                          atualizarDia(index, "valor", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* A MÁGICA AQUI: Se tiver mais de 1 dia na lista, qualquer dia pode ser apagado! */}
                  {novoEvento.programacao.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerDia(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "transparent",
                        border: "none",
                        color: "#ff003c",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="fonte-quadrada"
                onClick={adicionarDia}
                style={{
                  background: "#222",
                  color: "#fff",
                  border: "1px dashed #444",
                  width: "100%",
                  padding: "10px",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                }}
              >
                + ADICIONAR PRÓXIMO DIA
              </button>
            </div>
          )}

          {/* BLOCO 4: LINKS, FLYER, VALOR GERAL E INFOS */}
          <input
            type="url"
            placeholder="URL DO FLYER (Imagem)"
            className="input-bruto fonte-texto"
            style={{ marginTop: "15px" }}
            value={novoEvento.imagem_url}
            onChange={(e) =>
              setNovoEvento({ ...novoEvento, imagem_url: e.target.value })
            }
          />

          <input
            type="url"
            placeholder="LOCALIZAÇÃO (Link do Google Maps)"
            className="input-bruto fonte-texto"
            value={novoEvento.localizacao_url}
            onChange={(e) =>
              setNovoEvento({ ...novoEvento, localizacao_url: e.target.value })
            }
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "5px",
            }}
          >
            <input
              type="text"
              placeholder="GÊNEROS (Ex: UKG, Hard)"
              className="input-bruto fonte-texto"
              value={novoEvento.generos}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, generos: e.target.value })
              }
            />

            <input
              type="number"
              step="0.01"
              placeholder={
                novoEvento.tipo_evento === "festival"
                  ? "VALOR DO PASSAPORTE (R$)"
                  : "VALOR INGRESSO (R$)"
              }
              className="input-bruto fonte-texto"
              value={novoEvento.valor}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, valor: e.target.value })
              }
            />
          </div>

          <input
            type="url"
            placeholder="LINK DO INGRESSO / SHOTGUN"
            className="input-bruto fonte-texto"
            value={novoEvento.link_ingresso}
            onChange={(e) =>
              setNovoEvento({ ...novoEvento, link_ingresso: e.target.value })
            }
          />

          <textarea
            placeholder="LINE-UP GERAL (Artistas separados por vírgula)"
            className="input-bruto fonte-texto"
            style={{ height: "80px", paddingTop: "10px" }}
            required
            value={novoEvento.lista_artistas}
            onChange={(e) =>
              setNovoEvento({ ...novoEvento, lista_artistas: e.target.value })
            }
          />

          <div
            className="modal-btns"
            style={{ display: "flex", gap: "10px", marginTop: "15px" }}
          >
            <button
              type="button"
              className="btn-acao fonte-quadrada"
              style={{ background: "#333" }}
              onClick={fecharModal}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="btn-acao fonte-quadrada"
              style={{ background: "#ff003c" }}
            >
              GRAVAR EVENTO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarEvento;
