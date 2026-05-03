import React, { useState } from 'react';

function MeusEventos({ eventos, usuarioLogado, setEventos }) {
  const [editando, setEditando] = useState(null);

  // 1. Filtrar eventos do produtor
  const meusEventos = (eventos || []).filter(e => {
    const criador = String(e.criado_por || '').trim().toLowerCase();
    const logado = String(usuarioLogado?.vulgo || usuarioLogado?.nome || '').trim().toLowerCase();
    return criador === logado && logado !== '';
  });

  // 2. Verificar permissões
  const temPermissaoProdutor = usuarioLogado?.funcoes?.toUpperCase().includes('PRODUTOR') || 
                               usuarioLogado?.funcoes?.toUpperCase().includes('EVENTO');

 // 3. Função de salvar
const handleSalvar = async (e) => {
    e.preventDefault();
    
    // 1. O TRUQUE DA DATA: Garante que a data mestre nunca vá vazia
    const dataPrincipal = editando.tipo_evento === 'festival' && editando.programacao?.length > 0 
      ? editando.programacao[0].data 
      : editando.data_hora;

    // 2. Prepara os dados pro Banco de Dados
    const dadosParaSalvar = {
      ...editando,
      data_hora: dataPrincipal, 
      
      // 👇 A CORREÇÃO MESTRA: A lista vai pura pro Back-end! Sem stringify aqui.
      programacao: editando.programacao, 
      
      criado_por: usuarioLogado?.vulgo || usuarioLogado?.nome 
    };

    try {
      const response = await fetch(`http://localhost:3000/api/eventos/${editando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaSalvar) 
      });

      if (response.ok) {
        alert("🔥 Evento atualizado na cena!");
        
        // A SOLUÇÃO DEFINITIVA: Recarrega a página pra puxar perfeitamente do banco
        // e limpar qualquer "sujeira" visual do React.
        window.location.reload();

      } else {
        alert("Erro ao salvar no banco. Verifique o terminal do servidor.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Servidor offline ou erro de conexão.");
    }
  };

  // --- RENDER 1: SE ESTIVER EDITANDO ---
  if (editando) {
    // --- FUNÇÕES DOS DIAS DO FESTIVAL ---
    const adicionarDia = () => {
      const diasAtuais = Array.isArray(editando.programacao) ? [...editando.programacao] : [];
      diasAtuais.push({ data: '', valor: '', lineup: '' });
      setEditando({ ...editando, programacao: diasAtuais });
    };

    const atualizarDia = (index, campo, valor) => {
      const diasAtuais = [...editando.programacao];
      diasAtuais[index] = { ...diasAtuais[index], [campo]: valor };
      setEditando({ ...editando, programacao: diasAtuais });
    };

    const removerDia = (index) => {
      const diasAtuais = [...editando.programacao];
      diasAtuais.splice(index, 1);
      setEditando({ ...editando, programacao: diasAtuais });
    };

    return (
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
        <button onClick={() => setEditando(null)} className="fonte-quadrada" style={{ color: '#ff003c', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← CANCELAR EDIÇÃO</button>
        <h2 className="fonte-quadrada" style={{ color: '#fff', fontSize: '2rem' }}>EDITAR: {editando.titulo}</h2>
        
        <form onSubmit={handleSalvar} style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
          
          {/* --- BLOCO 1: TIPO E VALOR --- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <label className="fonte-texto" style={{ color: '#666' }}>Tipo do Rolê
              <select 
                value={editando.tipo_evento || 'unico'} 
                onChange={e => {
                  const novoTipo = e.target.value;
                  let novaProgramacao = [...(editando.programacao || [])];

                  // A MÁGICA AQUI: Se mudar pra festival e estiver vazio, puxa os dados do topo
                  if (novoTipo === 'festival' && novaProgramacao.length === 0) {
                    novaProgramacao = [{
                      data: editando.data_hora || '', 
                      valor: editando.valor || '',
                      lineup: editando.lista_artistas || ''
                    }];
                  }

                  setEditando({
                    ...editando, 
                    tipo_evento: novoTipo,
                    programacao: novaProgramacao
                  });
                }} 
                style={inputStyle}
              >
                <option value="unico">Evento Único (1 dia)</option>
                <option value="festival">Festival (Vários dias)</option>
              </select>
            </label>
            <label className="fonte-texto" style={{ color: '#666' }}>
              {editando.tipo_evento === 'festival' ? 'Valor do Passaporte (Todos os dias)' : 'Valor do Ingresso (R$)'}
              <input type="number" step="0.01" value={editando.valor || ''} onChange={e => setEditando({...editando, valor: e.target.value})} placeholder={editando.tipo_evento === 'festival' ? "Ex: 150.00 (Deixe vazio se não houver passaporte)" : "Ex: 40.00"} style={inputStyle} />
            </label>
          </div>

          {/* --- BLOCO 2: DATAS GERAIS (SÓ APARECE SE FOR EVENTO ÚNICO) --- */}
          {editando.tipo_evento !== 'festival' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <label className="fonte-texto" style={{ color: '#666' }}>Início (Data e Hora) *
                <input type="datetime-local" value={editando.data_hora || ''} onChange={e => setEditando({...editando, data_hora: e.target.value})} style={inputStyle} required />
              </label>
            </div>
          )}

          {/* --- BLOCO 3: INFOS PRINCIPAIS --- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', background: '#0a0a0a', padding: '20px', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
            <label className="fonte-texto" style={{ color: '#888' }}>Nome do Evento *
              <input type="text" value={editando.titulo || ''} onChange={e => setEditando({...editando, titulo: e.target.value})} style={inputStyle} required />
            </label>
            <label className="fonte-texto" style={{ color: '#888' }}>Flyer (URL da Imagem)
              <input type="url" value={editando.imagem_url || ''} onChange={e => setEditando({...editando, imagem_url: e.target.value})} style={inputStyle} />
            </label>
          </div>

          {/* --- BLOCO 4: LOCAL E LINKS --- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <label className="fonte-texto" style={{ color: '#888' }}>Local (Nome do pico)
              <input type="text" value={editando.local || ''} onChange={e => setEditando({...editando, local: e.target.value})} style={inputStyle} />
            </label>
            <label className="fonte-texto" style={{ color: '#888' }}>Localização (Google Maps URL)
              <input type="url" value={editando.localizacao_url || ''} onChange={e => setEditando({...editando, localizacao_url: e.target.value})} style={inputStyle} />
            </label>
            <label className="fonte-texto" style={{ color: '#888' }}>Link do Ingresso / Shotgun
              <input type="url" value={editando.link_ingresso || ''} onChange={e => setEditando({...editando, link_ingresso: e.target.value})} style={inputStyle} />
            </label>
          </div>

          {/* --- BLOCO 5: PROGRAMAÇÃO DO FESTIVAL DINÂMICA --- */}
          {editando.tipo_evento === 'festival' && (
            <div style={{ background: '#111', padding: '20px', borderRadius: '8px', gridColumn: '1 / -1', borderLeft: '4px solid #ff003c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 className="fonte-quadrada" style={{ color: '#fff', margin: '0 0 5px 0' }}>BILHETES DIÁRIOS E PROGRAMAÇÃO</h3>
                  <p className="fonte-texto" style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Adicione os dias específicos do festival para quem quer comprar avulso.</p>
                </div>
                <button type="button" onClick={adicionarDia} style={{ background: '#ff003c', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', transition: '0.2s' }}>
                  + ADICIONAR NOVO DIA
                </button>
              </div>

              {Array.isArray(editando.programacao) && editando.programacao.map((dia, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(100px, 1fr) minmax(200px, 2fr) auto', gap: '15px', marginBottom: '15px', alignItems: 'end', background: '#050505', padding: '20px', border: '1px dashed #333', borderRadius: '6px' }}>
                  <label className="fonte-texto" style={{ color: '#888', fontSize: '0.8rem' }}>Data e Hora (Dia {index + 1})
                    <input type="datetime-local" value={dia.data || ''} onChange={e => atualizarDia(index, 'data', e.target.value)} style={inputStyle} required />
                  </label>
                  <label className="fonte-texto" style={{ color: '#888', fontSize: '0.8rem' }}>Ingresso Dia (R$)
                    <input type="number" step="0.01" value={dia.valor || ''} onChange={e => atualizarDia(index, 'valor', e.target.value)} placeholder="0.00" style={inputStyle} />
                  </label>
                  <label className="fonte-texto" style={{ color: '#888', fontSize: '0.8rem' }}>Artistas deste dia
                    <input type="text" value={dia.lineup || ''} onChange={e => atualizarDia(index, 'lineup', e.target.value)} placeholder="Ex: DJ A, DJ B" style={inputStyle} required />
                  </label>
                  <button type="button" onClick={() => removerDia(index)} style={{ background: 'transparent', color: '#ff003c', border: '1px solid #ff003c', padding: '10px', cursor: 'pointer', height: '42px', marginBottom: '5px', borderRadius: '4px', fontWeight: 'bold' }}>X</button>
                </div>
              ))}
              
              {(!editando.programacao || editando.programacao.length === 0) && (
                <div style={{ textAlign: 'center', padding: '30px', background: '#050505', borderRadius: '6px', border: '1px dashed #333' }}>
                  <p style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.9rem', margin: 0 }}>Nenhum dia de festival configurado.</p>
                </div>
              )}
            </div>
          )}

          {/* --- BLOCO 6: LINE-UP GERAL E INFOS --- */}
          <div style={{ display: 'grid', gap: '20px' }}>
            <label className="fonte-texto" style={{ color: '#888' }}>Gêneros Musicais
              <input type="text" value={editando.generos || ''} onChange={e => setEditando({...editando, generos: e.target.value})} placeholder="Ex: Hard Techno, UK Garage, Dubstep..." style={inputStyle} />
            </label>
            
            <label className="fonte-texto" style={{ color: '#888' }}>Line-up Geral (Vulgos dos Artistas separados por vírgula) *
              <input type="text" value={editando.lista_artistas || ''} onChange={e => setEditando({...editando, lista_artistas: e.target.value})} placeholder="Ex: Bea, Dj Caos, W3LLY" style={inputStyle} required />
            </label>

            <label className="fonte-texto" style={{ color: '#888' }}>Descrição do Rolê
              <textarea value={editando.informacoes || ''} onChange={e => setEditando({...editando, informacoes: e.target.value})} style={{...inputStyle, height: '120px'}} />
            </label>
          </div>

          <button type="submit" className="btn-destaque fonte-quadrada" style={{ padding: '20px', fontSize: '1.2rem', background: '#ff003c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '20px' }}>
            SALVAR ALTERAÇÕES
          </button>
        </form>
      </div>
    );
  }

  // --- RENDER 2: SE NÃO TEM PERMISSÃO ---
  if (!temPermissaoProdutor) {
    return <TelaMeusEventosVazia />;
  }

  // --- RENDER 3: SE É PRODUTOR MAS NÃO TEM EVENTOS ---
  if (meusEventos.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 className="fonte-quadrada" style={{ color: '#fff' }}>VOCÊ AINDA NÃO TEM EVENTOS</h2>
        <p className="fonte-texto" style={{ color: '#666', marginBottom: '20px' }}>Clique no botão "Novo Evento" no topo para começar.</p>
      </div>
    );
  }

  // --- RENDER 4: LISTA DE EVENTOS COM BOTÃO DE EDIÇÃO ---
  return (
    <div style={{ padding: '40px' }}>
      <h2 className="fonte-quadrada" style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '30px' }}>MEUS EVENTOS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {meusEventos.map(e => (
          <div key={e.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '8px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ background: e.tipo_evento === 'festival' ? '#ff003c' : '#111', color: '#fff', padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                {e.tipo_evento === 'festival' ? 'FESTIVAL' : 'ÚNICO'}
              </span>
              {e.valor && <span style={{ color: '#00ff00', fontSize: '0.8rem', fontFamily: 'monospace' }}>R$ {Number(e.valor).toFixed(2)}</span>}
            </div>

            <h3 className="fonte-quadrada" style={{ color: '#fff', margin: '0 0 10px 0' }}>{e.titulo}</h3>
            <p className="fonte-texto" style={{ color: '#666', margin: '0 0 5px 0' }}>📅 {new Date(e.data_hora).toLocaleDateString('pt-BR')}</p>
            <p className="fonte-texto" style={{ color: '#666', margin: '0' }}>📍 {e.local || 'Local não definido'}</p>
            
            <button 
              onClick={() => {
                // BLINDAGEM DA DATA: Formata seguro pro banco
                const formataSeguro = (dataOriginal) => {
                  if (!dataOriginal) return '';
                  if (typeof dataOriginal === 'string' && dataOriginal.includes('T') && dataOriginal.length === 16) return dataOriginal;
                  try {
                    const data = new Date(dataOriginal);
                    if (isNaN(data.getTime())) return '';
                    const offset = data.getTimezoneOffset() * 60000;
                    return (new Date(data.getTime() - offset)).toISOString().slice(0, 16);
                  } catch (err) { return ''; }
                };

                // PREPARAÇÃO DO FESTIVAL: Converte pra Array sem dar erro
                let programacaoArray = [];
                try {
                  programacaoArray = typeof e.programacao === 'string' ? JSON.parse(e.programacao) : (e.programacao || []);
                  if (!Array.isArray(programacaoArray)) programacaoArray = [];
                } catch(err) { programacaoArray = []; }

                // SETA O EDITANDO SEGURO
                setEditando({
                  ...e,
                  data_hora: formataSeguro(e.data_hora),
                  data_fim: formataSeguro(e.data_fim),
                  programacao: programacaoArray
                });
              }}
              className="fonte-quadrada" 
              style={{ marginTop: '20px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', width: '100%', transition: '0.2s' }}
              onMouseOver={el => el.target.style.background = '#ff003c'}
              onMouseOut={el => el.target.style.background = '#222'}
            >
              EDITAR ROLÊ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ESTILOS
const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#050505',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '4px',
  marginTop: '5px',
  outline: 'none',
  fontFamily: 'monospace',
  boxSizing: 'border-box'
};

const TelaMeusEventosVazia = () => {
  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px', background: '#050505' }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#1a1a1a', border: '2px solid #1a1a1a', padding: '20px', borderRadius: '50%' }}>
        🚫
      </div>

      <h1 className="fonte-quadrada" style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '10px' }}>
        PAINEL DO PRODUTOR
      </h1>
      
      <p className="fonte-texto" style={{ color: '#888', maxWidth: '500px', lineHeight: '1.6', fontSize: '1.1rem' }}>
        Parece que você ainda não tem permissão para gerenciar eventos. 
        Esta área é exclusiva para quem movimenta a cena e organiza os corre.
      </p>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button className="fonte-quadrada" style={{ background: '#ff003c', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.location.href = '/feed'}>
          VOLTAR PARA O FEED
        </button>

        <button className="fonte-quadrada" style={{ background: 'transparent', color: '#ff003c', border: '1px solid #ff003c', padding: '12px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.open('https://wa.me/SEUNUMERO', '_blank')}>
          QUERO SER PRODUTOR
        </button>
      </div>
    </div>
  );
};

export default MeusEventos;