import React, { useState } from "react";

const Configuracoes = ({ usuarioLogado }) => {
  // Estados para simular as configurações na tela
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  // Estados dos novos módulos (Simulação para o Front-end)
  const [radarLineup, setRadarLineup] = useState(true);
  const [radarEventos, setRadarEventos] = useState(true);
  const [modoFantasma, setModoFantasma] = useState(false);

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "ERRO: AS SENHAS NÃO CONFEREM." });
      return;
    }
    if (!senhaAtual || !novaSenha) {
      setMensagem({ tipo: "erro", texto: "ERRO: PARÂMETROS AUSENTES." });
      return;
    }
    setMensagem({
      tipo: "sucesso",
      texto: "SISTEMA: CREDENCIAIS ATUALIZADAS COM SUCESSO.",
    });
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
  };

  const handleExcluirConta = () => {
    const confirmar = window.confirm(
      "!!! ALERTA DO SISTEMA !!!\n\nA exclusão é irreversível. Todos os seus dados na cena serão apagados. Prosseguir?",
    );
    if (confirmar)
      alert("Acesso negado: Função bloqueada para a apresentação.");
  };

  if (!usuarioLogado)
    return (
      <div style={{ color: "#fff", padding: "20px" }}>
        Carregando módulos...
      </div>
    );

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#fff",
        minHeight: "80vh",
        paddingBottom: "100px",
      }}
    >
      {/* CABEÇALHO ESTILO TERMINAL */}
      <div
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px dashed #333",
          paddingBottom: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            className="fonte-quadrada"
            style={{
              fontSize: "3rem",
              color: "#fff",
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            <span style={{ color: "#ff003c" }}>SYS</span>.CONFIG
          </h1>
          <p
            className="fonte-texto"
            style={{
              color: "#666",
              marginTop: "5px",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Módulos do Sistema e Preferências
          </p>
        </div>
        <div
          style={{
            textAlign: "right",
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              color: "#00ff00",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "#00ff00",
                borderRadius: "50%",
                boxShadow: "0 0 8px #00ff00",
              }}
            ></div>
            STATUS: ONLINE
          </div>
          <div style={{ color: "#666", marginTop: "5px" }}>
            ID DE OPERAÇÃO: #{usuarioLogado.id || "0000"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
        {/* BLOCO 1: SEGURANÇA */}
        <section className="bloco-config">
          <h2 className="titulo-bloco">
            <span className="tag-numero">01</span> CRIPTOGRAFIA E ACESSO
          </h2>
          <form
            onSubmit={handleAlterarSenha}
            style={{ display: "flex", flexDirection: "column", gap: "25px" }}
          >
            <div className="caixa-input">
              <label>CHAVE DE ACESSO ATUAL</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
              className="caixa-input"
            >
              <div>
                <label>NOVA CHAVE</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
              <div>
                <label>CONFIRMAR NOVA CHAVE</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-override">
              SOBRESCREVER DADOS
            </button>
          </form>
          {mensagem.texto && (
            <div
              style={{
                marginTop: "25px",
                padding: "15px",
                background: "#000",
                borderLeft: `4px solid ${mensagem.tipo === "sucesso" ? "#00ff00" : "#ff003c"}`,
                color: mensagem.tipo === "sucesso" ? "#00ff00" : "#ff003c",
                fontFamily: "monospace",
                fontSize: "0.9rem",
              }}
            >
              {mensagem.texto}
            </div>
          )}
        </section>

        {/* BLOCO 2: PRIVACIDADE E RADAR (NOVO) */}
        <section
          className="bloco-config"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            padding: "0",
            background: "transparent",
            border: "none",
          }}
        >
          {/* Sub-bloco: Privacidade */}
          <div className="bloco-config" style={{ margin: 0 }}>
            <h2 className="titulo-bloco">
              <span className="tag-numero">02</span> PRIVACIDADE
            </h2>

            <div className="item-toggle">
              <div>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                  MODO FANTASMA
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                  Ocultar seus eventos favoritados do perfil público.
                </p>
              </div>
              <button
                onClick={() => setModoFantasma(!modoFantasma)}
                className={`btn-toggle ${modoFantasma ? "on" : "off"}`}
              >
                {modoFantasma ? "[ ON ]" : "[ OFF ]"}
              </button>
            </div>
          </div>

          {/* Sub-bloco: Notificações */}
          <div className="bloco-config" style={{ margin: 0 }}>
            <h2 className="titulo-bloco">
              <span className="tag-numero">03</span> RADAR / ALARMES
            </h2>

            <div
              className="item-toggle"
              style={{
                borderBottom: "1px solid #1a1a1a",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              <div>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                  ALERTA DE LINE-UP
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                  Avisar quando marcarem seu vulgo em um evento.
                </p>
              </div>
              <button
                onClick={() => setRadarLineup(!radarLineup)}
                className={`btn-toggle ${radarLineup ? "on" : "off"}`}
              >
                {radarLineup ? "[ ON ]" : "[ OFF ]"}
              </button>
            </div>

            <div className="item-toggle">
              <div>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                  RADAR DE EVENTOS
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                  Receber lembrete 24h antes dos eventos de interesse.
                </p>
              </div>
              <button
                onClick={() => setRadarEventos(!radarEventos)}
                className={`btn-toggle ${radarEventos ? "on" : "off"}`}
              >
                {radarEventos ? "[ ON ]" : "[ OFF ]"}
              </button>
            </div>
          </div>
        </section>

        {/* BLOCO 4: ZONA DE PERIGO */}
        <section className="bloco-config hazard-zone">
          <div className="hazard-tape"></div>
          <h2 className="titulo-bloco" style={{ color: "#ff003c" }}>
            <span className="tag-numero hazard">!</span> ZONA CRÍTICA
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px" }}>
              <p
                className="fonte-texto"
                style={{ color: "#aaa", margin: "0 0 10px 0" }}
              >
                A exclusão apagará permanentemente seu histórico e presença em
                line-ups.
              </p>
              <p
                className="fonte-texto"
                style={{
                  color: "#ff003c",
                  margin: 0,
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                ESTA AÇÃO NÃO PODE SER DESFEITA.
              </p>
            </div>
            <button onClick={handleExcluirConta} className="btn-danger">
              PURGAR CONTA
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .bloco-config { background: transparent; padding: 40px; border: 1px solid #1a1a1a; position: relative; }
        .titulo-bloco { color: '#fff'; margin-bottom: 30px; font-size: 1.2rem; display: flex; align-items: center; gap: 15px; font-family: 'Space Mono', monospace; text-transform: uppercase; }
        .tag-numero { background: #ff003c; color: #000; padding: 2px 8px; font-size: 1rem; }
        .tag-numero.hazard { background: transparent; border: 1px solid #ff003c; color: #ff003c; }
        
        .caixa-input { background: transparent; padding: 20px; border: 1px dashed #222; }
        .caixa-input label { display: block; color: #888; margin-bottom: 10px; font-size: 0.8rem; letter-spacing: 1px; font-family: monospace; }
        .caixa-input input { background: #000; border: 1px solid #333; border-bottom: 2px solid #555; padding: 15px; color: #fff; width: 100%; outline: none; font-family: monospace; font-size: 1rem; transition: all 0.3s; box-sizing: border-box; }
        .caixa-input input:focus { border-color: #ff003c; background: #050000; box-shadow: 0 0 10px rgba(255,0,60,0.1); }
        
        .btn-override { background: #fff; color: #000; border: none; padding: 15px 25px; cursor: pointer; font-weight: bold; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; transition: all 0.2s; width: max-content; align-self: flex-start; }
        .btn-override:hover { background: #ff003c; color: #fff; box-shadow: 4px 4px 0 #33000c; transform: translate(-2px, -2px); }

        .hazard-zone { border: 1px solid #330000; }
        .hazard-tape { position: absolute; top: 0; left: 0; right: 0; height: 10px; background: repeating-linear-gradient(45deg, #ff003c, #ff003c 15px, #111 15px, #111 30px); }
        .btn-danger { background: transparent; color: #ff003c; border: 2px solid #ff003c; padding: 15px 25px; cursor: pointer; font-weight: bold; font-family: monospace; letter-spacing: 1px; transition: all 0.2s; }
        .btn-danger:hover { background: #ff003c; color: #fff; }

        .item-toggle { display: flex; justify-content: space-between; align-items: center; font-family: monospace; gap: 20px; }
        .btn-toggle { background: transparent; border: none; font-family: monospace; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.2s; padding: 5px 10px; }
        .btn-toggle.on { color: #00ff00; text-shadow: 0 0 8px rgba(0,255,0,0.4); }
        .btn-toggle.off { color: #555; }
        .btn-toggle:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default Configuracoes;
