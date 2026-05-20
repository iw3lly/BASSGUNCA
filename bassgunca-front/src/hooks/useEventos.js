import { useState } from "react";
import { eventosAPI } from "../services/api";
import { eventoEncerrado } from "../utils/eventoStatus";

export function useEventos(usuarioLogado) {
  const [eventos, setEventos] = useState([]);

  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const [eventoSendoEditado, setEventoSendoEditado] = useState(null);

  // =========================================
  // CARREGAR EVENTOS
  // =========================================
  const carregarEventos = async () => {
    try {
      const dados = await eventosAPI.listar();

      // ordena:
      // 1. eventos ativos primeiro
      // 2. eventos mais próximos primeiro
      // 3. encerrados vão pro final
      const ordenados = [...dados].sort((a, b) => {
        const aEncerrado = eventoEncerrado(a);
        const bEncerrado = eventoEncerrado(b);

        // ativos primeiro
        if (aEncerrado !== bEncerrado) {
          return aEncerrado ? 1 : -1;
        }

        const dataA = new Date(a.data_hora).getTime();
        const dataB = new Date(b.data_hora).getTime();

        return dataA - dataB;
      });

      setEventos(ordenados);
    } catch (erro) {
      console.error("Erro ao carregar eventos", erro);
    }
  };

  // =========================================
  // INTERESSE
  // =========================================
  const handleToggleInteresse = async (idEvento) => {
    if (!usuarioLogado) return;

    const meuVulgo = (usuarioLogado.vulgo || usuarioLogado.nome).toUpperCase();

    try {
      const res = await eventosAPI.marcarInteresse(idEvento, meuVulgo);

      if (res.ok) {
        await carregarEventos();
      }
    } catch (erro) {
      console.error("Erro ao marcar interesse", erro);
    }
  };

  // =========================================
  // APAGAR EVENTO
  // =========================================
  const apagarEvento = async (id) => {
    const confirmar = window.confirm("Deseja mesmo excluir este evento?");

    if (!confirmar) return;

    try {
      await eventosAPI.apagar(id);

      await carregarEventos();
    } catch (erro) {
      console.error("Erro ao apagar evento", erro);
    }
  };

  // =========================================
  // EVENTOS ATIVOS
  // =========================================
  const eventosAtivos = eventos.filter((evento) => !eventoEncerrado(evento));

  // =========================================
  // EVENTOS ENCERRADOS
  // =========================================
  const eventosEncerrados = eventos.filter((evento) => eventoEncerrado(evento));

  return {
    eventos,

    eventosAtivos,

    eventosEncerrados,

    carregarEventos,

    handleToggleInteresse,

    apagarEvento,

    eventoSelecionado,

    setEventoSelecionado,

    eventoSendoEditado,

    setEventoSendoEditado,
  };
}
