import { useState } from "react";
import "./Login.css";
import logoImg from "./assets/logo.png";

function Login({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Novos Estados para Cadastro
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [vulgo, setVulgo] = useState("");
  const [cidade, setCidade] = useState("");
  const [redesSociais, setRedesSociais] = useState("");
  const [funcoesSelecionadas, setFuncoesSelecionadas] = useState([]);

  const [erro, setErro] = useState("");

  const toggleFuncao = (funcao) => {
    if (funcoesSelecionadas.includes(funcao)) {
      setFuncoesSelecionadas(funcoesSelecionadas.filter((f) => f !== funcao));
    } else {
      setFuncoesSelecionadas([...funcoesSelecionadas, funcao]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const resposta = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (resposta.ok) {
        onLogin(dados.usuario);
      } else {
        setErro(dados.erro || "Erro ao entrar.");
      }
    } catch (err) {
      setErro("Servidor fora do ar.");
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    const funcoesString = funcoesSelecionadas.join(",");

    if (!isLoginMode && funcoesString === "") {
      setErro("Escolha pelo menos uma função na cena.");
      return;
    }
    try {
      const resposta = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCompleto,
          vulgo: vulgo,
          cidade: cidade,
          redes_sociais: redesSociais,
          email: email,
          senha: senha,
          funcoes: funcoesString,
        }),
      });
      if (resposta.ok) {
        alert("Conta criada com sucesso! Faça o login agora.");
        setIsLoginMode(true);
      } else {
        const dados = await resposta.json();
        setErro(dados.erro || "Erro ao criar conta.");
      }
    } catch (err) {
      setErro("Erro de conexão.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src={logoImg}
          alt="Bassgunça"
          style={{ width: "150px", marginBottom: "20px" }}
        />
        <h2 className="fonte-quadrada">
          {isLoginMode ? "ACESSO VIP" : "NOVO NA BASSGUNÇA?"}
        </h2>

        {erro && <div className="erro-msg">⚠️ {erro}</div>}

        <form onSubmit={isLoginMode ? handleLogin : handleCadastro}>
          {!isLoginMode && (
            <>
              <input
                type="text"
                placeholder="NOME COMPLETO"
                className="input-bruto fonte-texto"
                required
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
              <input
                type="text"
                placeholder="VULGO / NOME ARTÍSTICO"
                className="input-bruto fonte-texto"
                required
                value={vulgo}
                onChange={(e) => setVulgo(e.target.value)}
              />

              <div
                style={{
                  textAlign: "left",
                  marginBottom: "20px",
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                <p
                  className="fonte-quadrada"
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.2rem",
                    color: "#fff",
                  }}
                >
                  QUAL É SUA FUNÇÃO?
                </p>
                <div className="funcoes-grid">
                  {[
                    {
                      id: "Artista",
                      desc: "Canto, faço música",
                      icone: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      ),
                    },
                    {
                      id: "Produtor",
                      desc: "Produzo beats, mixagens",
                      icone: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                          <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z" />
                        </svg>
                      ),
                    },
                    {
                      id: "Grupo/Banda",
                      desc: "Somos um grupo",
                      icone: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ),
                    },
                    {
                      id: "Evento",
                      desc: "Organizo shows e festas",
                      icone: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      ),
                    },
                    {
                      id: "Público",
                      desc: "Fortaleço a cena na pista",
                      icone: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                        </svg>
                      ),
                    },
                    {
                      id: "Outro",
                      desc: "Outra função na cena",
                      icone: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      ),
                    },
                  ].map((f) => (
                    <label key={f.id} className="card-funcao-label">
                      <input
                        type="checkbox"
                        className="card-funcao-checkbox"
                        checked={funcoesSelecionadas.includes(f.id)}
                        onChange={() => toggleFuncao(f.id)}
                      />
                      <div className="card-funcao-box">
                        <div className="card-funcao-icone">{f.icone}</div>
                        <span className="card-funcao-titulo fonte-quadrada">
                          {f.id}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="CIDADE (Ex: Ceilândia - DF)"
                className="input-bruto fonte-texto"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              {/* Note que este campo abaixo não tem o atributo "required", logo, é opcional */}
              <input
                type="text"
                placeholder="REDES SOCIAIS / @ (Opcional)"
                className="input-bruto fonte-texto"
                value={redesSociais}
                onChange={(e) => setRedesSociais(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="E-MAIL"
            className="input-bruto fonte-texto"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="SENHA"
            className="input-bruto fonte-texto"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit" className="btn-acao fonte-quadrada">
            {isLoginMode ? "ENTRAR NA CENA" : "CRIAR CONTA"}
          </button>
        </form>

        <p
          className="link-toggle fonte-quadrada"
          onClick={() => setIsLoginMode(!isLoginMode)}
          style={{ marginTop: "20px", fontSize: "1.2rem" }}
        >
          {isLoginMode
            ? "Ainda não está na cena? Cadastre-se"
            : "Já tem acesso? Faça Login"}
        </p>
      </div>
    </div>
  );
}

export default Login;
