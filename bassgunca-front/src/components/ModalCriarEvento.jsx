import React, { useState } from "react";
import toast from "react-hot-toast";

import "./ModalCriarEvento.css";

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

        id_produtor: usuarioLogado?.id,
        usuario_id: usuarioLogado?.id,
        criado_por: usuarioLogado?.vulgo || usuarioLogado?.nome || "Anônimo",
      };

      const resposta = await fetch("http://localhost:3000/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (resposta.ok) {
        toast.success("Evento lançado na cena 🔥");

        onEventoCriado();

        // Força o recarregamento pra garantir que a tela 'Meus Eventos' puxe os dados novos
        window.location.reload();
      } else {
        toast.error("Erro ao criar evento.");
      }
    } catch (erro) {
      console.error(erro);
      toast.error("Erro de conexão.");
    }
  };

  const adicionarDia = () => {
    setNovoEvento({
      ...novoEvento,
      programacao: [
        ...novoEvento.programacao,
        {
          data: "",
          lineup: "",
          valor: "",
        },
      ],
    });
  };

  const removerDia = (index) => {
    const filtrados = novoEvento.programacao.filter((_, i) => i !== index);

    setNovoEvento({
      ...novoEvento,
      programacao: filtrados,
    });
  };

  const atualizarDia = (index, campo, valor) => {
    const novosDias = [...novoEvento.programacao];

    novosDias[index][campo] = valor;

    setNovoEvento({
      ...novoEvento,
      programacao: novosDias,
    });
  };

  return (
    <div className="evento-modal-overlay">
      <div className="evento-modal">
        {/* HEADER */}
        <div className="evento-modal-header">
          <div>
            <span className="evento-modal-mini fonte-quadrada">
              NOVO EVENTO
            </span>

            <h2 className="evento-modal-title fonte-quadrada">
              LANÇAR NA CENA
            </h2>
          </div>

          <button className="evento-modal-close" onClick={fecharModal}>
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="evento-form">
          {/* NOME */}
          <div className="evento-field">
            <label className="evento-label fonte-quadrada">
              NOME DO EVENTO
            </label>

            <input
              type="text"
              placeholder="Ex: SUBWORLD"
              className="evento-input fonte-texto"
              required
              value={novoEvento.titulo}
              onChange={(e) =>
                setNovoEvento({
                  ...novoEvento,
                  titulo: e.target.value,
                })
              }
            />
          </div>

          {/* LOCAL */}
          <div className="evento-field">
            <label className="evento-label fonte-quadrada">LOCAL</label>

            <input
              type="text"
              placeholder="Ex: SUB DULCINA"
              className="evento-input fonte-texto"
              required
              value={novoEvento.local}
              onChange={(e) =>
                setNovoEvento({
                  ...novoEvento,
                  local: e.target.value,
                })
              }
            />
          </div>

          {/* TIPO */}
          <div className="evento-field">
            <label className="evento-label fonte-quadrada">FORMATO</label>

            <select
              className="evento-input fonte-texto"
              value={novoEvento.tipo_evento}
              onChange={(e) => {
                const tipo = e.target.value;

                let prog = [...novoEvento.programacao];

                if (tipo === "festival" && prog.length === 0) {
                  prog = [
                    {
                      data: "",
                      lineup: "",
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

              <option value="festival">FESTIVAL / MÚLTIPLOS DIAS</option>
            </select>
          </div>

          {/* DATA */}
          {novoEvento.tipo_evento === "unico" && (
            <div className="evento-field">
              <label className="evento-label fonte-quadrada">DATA E HORA</label>

              <input
                type="datetime-local"
                className="evento-input fonte-texto"
                required
                style={{ colorScheme: "dark" }}
                value={novoEvento.data_hora}
                onChange={(e) =>
                  setNovoEvento({
                    ...novoEvento,
                    data_hora: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* FESTIVAL */}
          {novoEvento.tipo_evento === "festival" && (
            <div className="evento-festival-box">
              <div className="evento-festival-top">
                <h3 className="fonte-quadrada">DIAS DO FESTIVAL</h3>

                <button
                  type="button"
                  className="evento-add-day fonte-quadrada"
                  onClick={adicionarDia}
                >
                  + ADICIONAR DIA
                </button>
              </div>

              {novoEvento.programacao.map((dia, index) => (
                <div key={index} className="evento-dia-card">
                  <button
                    type="button"
                    className="evento-remove-day"
                    onClick={() => removerDia(index)}
                  >
                    ✕
                  </button>

                  <div className="evento-field">
                    <label className="evento-label fonte-quadrada">DATA</label>

                    <input
                      type="datetime-local"
                      className="evento-input fonte-texto"
                      style={{ colorScheme: "dark" }}
                      required
                      value={dia.data}
                      onChange={(e) =>
                        atualizarDia(index, "data", e.target.value)
                      }
                    />
                  </div>

                  <div className="evento-grid">
                    <div className="evento-field">
                      <label className="evento-label fonte-quadrada">
                        LINE-UP
                      </label>

                      <input
                        type="text"
                        placeholder="DJ A, DJ B..."
                        className="evento-input fonte-texto"
                        required
                        value={dia.lineup}
                        onChange={(e) =>
                          atualizarDia(index, "lineup", e.target.value)
                        }
                      />
                    </div>

                    <div className="evento-field">
                      <label className="evento-label fonte-quadrada">
                        VALOR
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        placeholder="40"
                        className="evento-input fonte-texto"
                        value={dia.valor}
                        onChange={(e) =>
                          atualizarDia(index, "valor", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GRID */}
          <div className="evento-grid">
            <div className="evento-field">
              <label className="evento-label fonte-quadrada">GÊNEROS</label>

              <input
                type="text"
                placeholder="UKG, HARD..."
                className="evento-input fonte-texto"
                value={novoEvento.generos}
                onChange={(e) =>
                  setNovoEvento({
                    ...novoEvento,
                    generos: e.target.value,
                  })
                }
              />
            </div>

            <div className="evento-field">
              <label className="evento-label fonte-quadrada">VALOR</label>

              <input
                type="number"
                step="0.01"
                placeholder="R$"
                className="evento-input fonte-texto"
                value={novoEvento.valor}
                onChange={(e) =>
                  setNovoEvento({
                    ...novoEvento,
                    valor: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* LINKS */}
          <div className="evento-field">
            <label className="evento-label fonte-quadrada">FLYER</label>

            <input
              type="url"
              placeholder="URL da imagem"
              className="evento-input fonte-texto"
              value={novoEvento.imagem_url}
              onChange={(e) =>
                setNovoEvento({
                  ...novoEvento,
                  imagem_url: e.target.value,
                })
              }
            />
          </div>

          <div className="evento-field">
            <label className="evento-label fonte-quadrada">GOOGLE MAPS</label>

            <input
              type="url"
              placeholder="Link da localização"
              className="evento-input fonte-texto"
              value={novoEvento.localizacao_url}
              onChange={(e) =>
                setNovoEvento({
                  ...novoEvento,
                  localizacao_url: e.target.value,
                })
              }
            />
          </div>

          <div className="evento-field">
            <label className="evento-label fonte-quadrada">LINK INGRESSO</label>

            <input
              type="url"
              placeholder="Shotgun / Sympla..."
              className="evento-input fonte-texto"
              value={novoEvento.link_ingresso}
              onChange={(e) =>
                setNovoEvento({
                  ...novoEvento,
                  link_ingresso: e.target.value,
                })
              }
            />
          </div>

          {/* LINEUP */}
          <div className="evento-field">
            <label className="evento-label fonte-quadrada">LINE-UP GERAL</label>

            <textarea
              placeholder="Artistas separados por vírgula..."
              className="evento-textarea fonte-texto"
              required
              value={novoEvento.lista_artistas}
              onChange={(e) =>
                setNovoEvento({
                  ...novoEvento,
                  lista_artistas: e.target.value,
                })
              }
            />
          </div>

          {/* BOTÕES */}
          <div className="evento-actions">
            <button
              type="button"
              className="evento-cancel fonte-quadrada"
              onClick={fecharModal}
            >
              CANCELAR
            </button>

            <button type="submit" className="evento-submit fonte-quadrada">
              PUBLICAR EVENTO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarEvento;
