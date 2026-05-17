import { useState } from "react";
import { eventosAPI } from "../services/api"; // 👈 Importando a API

export function useEventos(usuarioLogado) {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventoSendoEditado, setEventoSendoEditado] = useState(null);

  const carregarEventos = async () => {
    try {
      const dados = await eventosAPI.listar();
      setEventos(dados);
    } catch (erro) {
      console.error("Erro ao carregar eventos", erro);
    }
  };

  const handleToggleInteresse = async (idEvento) => {
    if (!usuarioLogado) return;
    const meuVulgo = (usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase();
    try {
      const res = await eventosAPI.marcarInteresse(idEvento, meuVulgo);
      if (res.ok) await carregarEventos();
    } catch (erro) {
      console.error("Erro ao marcar interesse", erro);
    }
  };

  const apagarEvento = async (id) => {
    if (window.confirm("Deseja mesmo excluir este evento?")) {
      try {
        await eventosAPI.apagar(id);
        await carregarEventos();
      } catch (erro) {
        console.error("Erro ao apagar evento", erro);
      }
    }
  };

  const eventosAtivos = eventos.filter(
    (e) => new Date(e.data_hora) > new Date(),
  );

  return {
    eventos,
    eventosAtivos,
    carregarEventos,
    handleToggleInteresse,
    apagarEvento,
    eventoSelecionado,
    setEventoSelecionado,
    eventoSendoEditado,
    setEventoSendoEditado,
  };
}
