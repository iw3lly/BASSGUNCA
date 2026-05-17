import { useState } from "react";
import { feedAPI } from "../services/api"; // 👈 Importando a API

export function useFeed(usuarioLogado) {
  const [feed, setFeed] = useState([]);
  const [novoPost, setNovoPost] = useState("");

  const carregarFeed = async () => {
    try {
      const dados = await feedAPI.listar();
      setFeed(dados);
    } catch (erro) {
      console.error("Erro ao carregar feed", erro);
    }
  };

  const handlePostarFeed = async (e) => {
    e.preventDefault();
    if (!novoPost.trim() || !usuarioLogado) return;

    const vulgoAutor = (
      usuarioLogado.vulgo || usuarioLogado.nome
    ).toUpperCase();

    try {
      const { ok, data } = await feedAPI.criar({
        autor_vulgo: vulgoAutor,
        texto: novoPost,
      });

      if (ok) {
        setFeed((prev) => [
          {
            ...data,
            texto: novoPost,
            autor_vulgo: vulgoAutor,
            data_criacao: new Date(),
            editado: 0,
          },
          ...prev,
        ]);
        setNovoPost("");
      }
    } catch (erro) {
      console.error("Erro ao postar", erro);
    }
  };

  const editarPostFeed = async (id, novoTexto) => {
    try {
      const res = await feedAPI.editar(id, {
        mensagem: novoTexto,
        texto: novoTexto,
      });
      if (res.ok) {
        setFeed((prev) =>
          prev.map((post) =>
            post.id === id ? { ...post, texto: novoTexto, editado: 1 } : post,
          ),
        );
      }
    } catch (err) {
      console.error("Erro ao editar post:", err);
    }
  };

  const apagarPostFeed = async (id) => {
    if (!window.confirm("Apagar esse post?")) return;
    try {
      const res = await feedAPI.apagar(id);
      if (res.ok) setFeed((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Erro ao apagar post:", err);
    }
  };

  return {
    feed,
    novoPost,
    setNovoPost,
    carregarFeed,
    handlePostarFeed,
    editarPostFeed,
    apagarPostFeed,
  };
}
