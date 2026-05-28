import React, { useEffect, useState } from "react";

import "./Configuracoes.css";

const Configuracoes = ({ usuarioLogado }) => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState({
    tipo: "",
    texto: "",
  });

  const [preferencias, setPreferencias] = useState({
    radarLineup: true,
    radarEventos: true,
    modoFantasma: false,
    autoplayVideos: true,
    temaVermelho: true,
    mostrarPerfilPublico: true,
  });

  useEffect(() => {
    const salvas = localStorage.getItem("@bassgunca:config");

    if (salvas) {
      setPreferencias(JSON.parse(salvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("@bassgunca:config", JSON.stringify(preferencias));
  }, [preferencias]);

  const toggle = (campo) => {
    setPreferencias((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }));
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagem({
        tipo: "erro",
        texto: "Preencha todos os campos.",
      });

      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({
        tipo: "erro",
        texto: "As senhas não coincidem.",
      });

      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/api/usuarios/${usuarioLogado.id}/senha`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senhaAtual,
            novaSenha,
          }),
        },
      );

      if (resposta.ok) {
        setMensagem({
          tipo: "sucesso",
          texto: "Senha atualizada com sucesso.",
        });

        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        setMensagem({
          tipo: "erro",
          texto: "Erro ao atualizar senha.",
        });
      }
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: "Erro de conexão.",
      });
    }

    setTimeout(() => {
      setMensagem({
        tipo: "",
        texto: "",
      });
    }, 4000);
  };

  const handleExcluirConta = async () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta?",
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `http://localhost:3000/api/usuarios/${usuarioLogado.id}`,
        {
          method: "DELETE",
        },
      );

      if (resposta.ok) {
        localStorage.removeItem("@bassgunca:user_session");

        window.location.href = "/";
      }
    } catch (erro) {
      alert("Erro ao excluir conta.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("@bassgunca:user_session");

    window.location.href = "/";
  };

  if (!usuarioLogado) {
    return (
      <div
        style={{
          color: "#fff",
          padding: "40px",
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div className="config-page">
      {/* BG */}
      <div className="config-bg-glow"></div>

      {/* HERO */}
      <div className="config-hero">
        <div>
          <span className="config-badge fonte-quadrada">● SISTEMA ONLINE</span>

          <h1 className="config-title fonte-quadrada">
            CONFIG<span>URAÇÕES</span>
          </h1>

          <p className="config-subtitle fonte-texto">
            Controle total do seu perfil, privacidade e módulos da cena.
          </p>
        </div>

        <div className="config-profile-card">
          <div className="config-avatar fonte-quadrada">
            {usuarioLogado?.vulgo?.charAt(0)?.toUpperCase() ||
              usuarioLogado?.nome?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h3 className="fonte-quadrada">
              @{usuarioLogado?.vulgo || usuarioLogado?.nome}
            </h3>

            <p className="fonte-texto">USER ID #{usuarioLogado?.id}</p>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="config-grid">
        {/* SEGURANÇA */}
        <section className="config-card">
          <div className="card-top">
            <span>01</span>

            <h2 className="fonte-quadrada">SEGURANÇA</h2>
          </div>

          <form className="config-form" onSubmit={handleAlterarSenha}>
            <Input
              label="SENHA ATUAL"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />

            <div className="config-two">
              <Input
                label="NOVA SENHA"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />

              <Input
                label="CONFIRMAR"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            <button type="submit" className="primary-btn fonte-quadrada">
              ATUALIZAR SENHA
            </button>
          </form>

          {mensagem.texto && (
            <div className={`alert ${mensagem.tipo}`}>{mensagem.texto}</div>
          )}
        </section>

        {/* PRIVACIDADE */}
        <section className="config-card">
          <div className="card-top">
            <span>02</span>

            <h2 className="fonte-quadrada">PRIVACIDADE</h2>
          </div>

          <div className="toggle-list">
            <Toggle
              titulo="Modo Fantasma"
              descricao="Ocultar suas atividades e favoritos."
              ativo={preferencias.modoFantasma}
              onClick={() => toggle("modoFantasma")}
            />

            <Toggle
              titulo="Perfil Público"
              descricao="Permitir visualização do perfil."
              ativo={preferencias.mostrarPerfilPublico}
              onClick={() => toggle("mostrarPerfilPublico")}
            />
          </div>
        </section>

        {/* RADAR */}
        <section className="config-card">
          <div className="card-top">
            <span>03</span>

            <h2 className="fonte-quadrada">RADAR</h2>
          </div>

          <div className="toggle-list">
            <Toggle
              titulo="Radar de Eventos"
              descricao="Receber alertas importantes."
              ativo={preferencias.radarEventos}
              onClick={() => toggle("radarEventos")}
            />

            <Toggle
              titulo="Radar de Line-up"
              descricao="Aviso quando citarem seu nome."
              ativo={preferencias.radarLineup}
              onClick={() => toggle("radarLineup")}
            />
          </div>
        </section>

        {/* EXPERIÊNCIA */}
        <section className="config-card">
          <div className="card-top">
            <span>04</span>

            <h2 className="fonte-quadrada">EXPERIÊNCIA</h2>
          </div>

          <div className="toggle-list">
            <Toggle
              titulo="Autoplay de Vídeos"
              descricao="Reprodução automática no feed."
              ativo={preferencias.autoplayVideos}
              onClick={() => toggle("autoplayVideos")}
            />

            <Toggle
              titulo="Tema Vermelho"
              descricao="Glow vermelho no sistema."
              ativo={preferencias.temaVermelho}
              onClick={() => toggle("temaVermelho")}
            />
          </div>
        </section>

        {/* ZONA CRÍTICA */}
        <section className="config-card danger-card">
          <div className="danger-overlay"></div>

          <div className="card-top">
            <span>05</span>

            <h2 className="fonte-quadrada">ZONA CRÍTICA</h2>
          </div>

          <p className="danger-text fonte-texto">
            Essas ações são irreversíveis e afetam permanentemente sua conta.
          </p>

          <div className="danger-actions">
            <button
              onClick={handleLogout}
              className="secondary-btn fonte-quadrada"
            >
              SAIR
            </button>

            <button
              onClick={handleExcluirConta}
              className="danger-btn fonte-quadrada"
            >
              EXCLUIR CONTA
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

function Input({ label, type, value, onChange }) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}

function Toggle({ titulo, descricao, ativo, onClick }) {
  return (
    <div className="toggle-item">
      <div>
        <h4 className="fonte-quadrada">{titulo}</h4>

        <p className="fonte-texto">{descricao}</p>
      </div>

      <button
        onClick={onClick}
        className={`toggle-btn ${ativo ? "on" : "off"}`}
      ></button>
    </div>
  );
}

export default Configuracoes;
