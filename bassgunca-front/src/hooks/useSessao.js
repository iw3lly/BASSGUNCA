import { useState } from "react";

export function useSessao() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const savedData = localStorage.getItem("@bassgunca:user_session");
    if (savedData) {
      const session = JSON.parse(savedData);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem("@bassgunca:user_session");
        return null;
      }
      session.expiresAt = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem("@bassgunca:user_session", JSON.stringify(session));
      return session.usuario;
    }
    return null;
  });

  const handleSair = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("@bassgunca:user_session");
  };

  return {
    usuarioLogado,
    setUsuarioLogado,
    handleSair,
  };
}
