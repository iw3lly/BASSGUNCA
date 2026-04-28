import React, { useState } from 'react';

function ModalCriarEvento({ fecharModal, onEventoCriado }) {
  // O estado do formulário agora vive SÓ AQUI dentro
  const [novoEvento, setNovoEvento] = useState({ 
    titulo: '', 
    local: '', 
    data_hora: '', 
    tipo_evento: 'unico', 
    generos: '', 
    link_ingresso: '', 
    lista_artistas: '',
    valor_ingresso: '',
    dias_festival: [] 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEvento) 
      });
      
      if (resposta.ok) {
        alert("🔥 Evento adicionado ao line-up!");
        onEventoCriado(); // Avisa o App.jsx para recarregar a lista
        fecharModal();    // Fecha a janelinha
      } else {
        alert("Erro ao criar o evento.");
      }
    } catch (erro) { 
      console.error("Erro na conexão", erro); 
    }
  };

  const adicionarDia = () => {
    setNovoEvento({ 
      ...novoEvento, 
      dias_festival: [...novoEvento.dias_festival, { data: '', horario: '' }] 
    });
  };

  const removerDia = (index) => {
    const filtrados = novoEvento.dias_festival.filter((_, i) => i !== index);
    setNovoEvento({ ...novoEvento, dias_festival: filtrados });
  };

  const atualizarDia = (index, campo, valor) => {
    const novosDias = [...novoEvento.dias_festival];
    novosDias[index][campo] = valor;
    setNovoEvento({ ...novoEvento, dias_festival: novosDias });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="fonte-quadrada" style={{marginBottom: '20px', color: '#fff'}}>CRIAR EVENTO</h2>
        
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="NOME DO EVENTO" className="input-bruto fonte-texto" required 
                 value={novoEvento.titulo} onChange={e => setNovoEvento({...novoEvento, titulo: e.target.value})} />
          
          <input type="text" placeholder="LOCAL" className="input-bruto fonte-texto" required 
                 value={novoEvento.local} onChange={e => setNovoEvento({...novoEvento, local: e.target.value})} />
          
          <select className="input-bruto fonte-texto" value={novoEvento.tipo_evento} 
                  onChange={e => setNovoEvento({...novoEvento, tipo_evento: e.target.value})}>
            <option value="unico">DIA ÚNICO / CLUB</option>
            <option value="festival">FESTIVAL (MÚLTIPLOS DIAS)</option>
          </select>

          {/* DATA PRINCIPAL */}
          <div style={{display: 'flex', gap: '10px'}}>
            <div style={{flex: 1}}>
              <label className="fonte-texto" style={{color: '#aaa', fontSize: '0.7rem'}}>
                {novoEvento.tipo_evento === 'festival' ? 'INÍCIO DO FESTIVAL (DIA 1):' : 'DATA E HORA:'}
              </label>
              <input type="datetime-local" className="input-bruto fonte-texto" required 
                     value={novoEvento.data_hora} style={{colorScheme: 'dark'}} 
                     onChange={e => setNovoEvento({...novoEvento, data_hora: e.target.value})} />
            </div>
          </div>

          {/* CRONOGRAMA DO FESTIVAL */}
          {novoEvento.tipo_evento === 'festival' && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '15px' }}>
              <h4 className="fonte-quadrada" style={{ color: '#ff003c', marginBottom: '10px' }}>CRONOGRAMA (DIAS EXTRAS)</h4>
              
              {novoEvento.dias_festival.map((dia, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="fonte-texto" style={{ color: '#666', fontSize: '0.6rem' }}>DATA:</label>
                    <input type="date" className="input-bruto fonte-texto" style={{ colorScheme: 'dark' }} required
                           value={dia.data} onChange={e => atualizarDia(index, 'data', e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="fonte-texto" style={{ color: '#666', fontSize: '0.6rem' }}>ABERTURA:</label>
                    <input type="time" className="input-bruto fonte-texto" style={{ colorScheme: 'dark' }} required
                           value={dia.horario} onChange={e => atualizarDia(index, 'horario', e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removerDia(index)} 
                          style={{ background: 'transparent', border: 'none', color: '#ff003c', cursor: 'pointer', paddingBottom: '10px', fontSize: '1.2rem' }}>
                    ✕
                  </button>
                </div>
              ))}

              <button type="button" className="fonte-quadrada" onClick={adicionarDia}
                      style={{ background: '#222', color: '#fff', border: '1px dashed #444', width: '100%', padding: '10px', cursor: 'pointer', marginTop: '5px' }}>
                + ADICIONAR PRÓXIMO DIA
              </button>
            </div>
          )}

          <input type="text" placeholder="GÊNEROS (Ex: Hard Techno, UKG)" className="input-bruto fonte-texto" 
                 value={novoEvento.generos} onChange={e => setNovoEvento({...novoEvento, generos: e.target.value})} />
          
          <input type="number" step="0.01" placeholder="VALOR DO INGRESSO (Vazio se for 0800)" className="input-bruto fonte-texto" 
                 value={novoEvento.valor_ingresso} onChange={e => setNovoEvento({...novoEvento, valor_ingresso: e.target.value})} />

          <input type="url" placeholder="LINK DO INGRESSO / CORTESIA" className="input-bruto fonte-texto" 
                 value={novoEvento.link_ingresso} onChange={e => setNovoEvento({...novoEvento, link_ingresso: e.target.value})} />
          
          <textarea placeholder="LINE-UP (Nomes separados por vírgula)" className="input-bruto fonte-texto" style={{ height: '80px', paddingTop: '10px' }} required
                    value={novoEvento.lista_artistas} onChange={e => setNovoEvento({...novoEvento, lista_artistas: e.target.value})} />
          
          <div className="modal-btns" style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
            <button type="button" className="btn-acao fonte-quadrada" style={{background: '#333'}} onClick={fecharModal}>CANCELAR</button>
            <button type="submit" className="btn-acao fonte-quadrada">GRAVAR EVENTO</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarEvento;