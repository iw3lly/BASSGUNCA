export function eventoEncerrado(evento) {
  if (!evento) return false;

  // =========================================
  // FESTIVAL COM PROGRAMAÇÃO
  // =========================================
  if (
    evento.tipo_evento === "festival" &&
    Array.isArray(evento.programacao) &&
    evento.programacao.length > 0
  ) {
    const ultimaData = evento.programacao.reduce((ultima, dia) => {
      const dataDia = new Date(dia.data);

      return dataDia > ultima ? dataDia : ultima;
    }, new Date(0));

    return ultimaData < new Date();
  }

  // =========================================
  // EVENTO NORMAL
  // =========================================
  if (evento.data_hora) {
    return new Date(evento.data_hora) < new Date();
  }

  return false;
}
