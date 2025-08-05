"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useFormularios } from "~/contexts/formularios.context";
import type { Formulario } from "~/entities/formulario.entity";
import type { OpcaoRespostaPergunta } from "~/entities/opcoes-resposta-pergunta.entity";
import type { OpcaoResposta } from "~/entities/opcoes-respostas.entity";
import type { Pergunta } from "~/entities/pergunta.entity";

export const useFormGenerator = () => {
  const {
    adicionarFormulario,
    adicionarPerguntas,
    adicionarOpcoesRespostas,
    adicionarOpcoesRespostasPerguntas,
    adicionarCondicoesPerguntas,
  } = useFormularios();
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [opcoes, setOpcoes] = useState<Record<string, OpcaoResposta[]>>({});
  const [opcoesRespostasPerguntas, setOpcoesRespostasPerguntas] = useState<
    OpcaoRespostaPergunta[]
  >([]);
  const [condicoes, setCondicoes] = useState<
    Record<string, { perguntaId: string; opcaoId: string }>
  >({});
  const [createdFormId, setCreatedFormId] = useState<string | null>(null);

  const form = useForm<Formulario>({
    defaultValues: {
      id: uuidv4(),
      titulo: "",
      descricao: "",
      ordem: 1,
    },
  });

  const adicionarPergunta = useCallback(() => {
    const novaPergunta: Pergunta = {
      id: uuidv4(),
      id_formulario: form.getValues().id,
      titulo: "",
      codigo: "",
      orientacao_resposta: "",
      ordem: perguntas.length + 1,
      obrigatorio: false,
      sub_pergunta: false,
      tipo_pergunta: "texto_livre",
    };

    setPerguntas((prevPerguntas) => [...prevPerguntas, novaPergunta]);
    setOpcoes((prevOpcoes) => ({ ...prevOpcoes, [novaPergunta.id]: [] }));
  }, [form, perguntas]);

  const removerPergunta = (id: string) => {
    setPerguntas((prevPerguntas) => prevPerguntas.filter((p) => p.id !== id));
    setOpcoes((prevOpcoes) => {
      const novasOpcoes = { ...prevOpcoes };
      delete novasOpcoes[id];
      return novasOpcoes;
    });

    // Remover condições relacionadas a esta pergunta
    setCondicoes((prevCondicoes) => {
      const novasCondicoes = { ...prevCondicoes };
      Object.keys(novasCondicoes).forEach((key) => {
        if (novasCondicoes[key].perguntaId === id) {
          delete novasCondicoes[key];
        }
      });
      return novasCondicoes;
    });

    // Remover opções de resposta relacionadas a esta pergunta
    setOpcoesRespostasPerguntas((prevOrp) =>
      prevOrp.filter((orp) => orp.id_pergunta !== id),
    );
  };

  const atualizarPergunta = (id: string, campo: keyof Pergunta, valor: any) => {
    setPerguntas((prevPerguntas) =>
      prevPerguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
    );

    if (campo === "tipo_pergunta") {
      // Se o tipo for Sim/Não, cria as opções padrão e as adiciona ao estado
      if (valor === "sim_nao") {
        const simOpcao: OpcaoResposta = {
          id: "sim", // ID estático para a opção "Sim"
          id_pergunta: id,
          resposta: "Sim",
          ordem: 1,
          resposta_aberta: false,
        };
        const naoOpcao: OpcaoResposta = {
          id: "nao", // ID estático para a opção "Não"
          id_pergunta: id,
          resposta: "Não",
          ordem: 2,
          resposta_aberta: false,
        };
        setOpcoes((prev) => ({ ...prev, [id]: [simOpcao, naoOpcao] }));
      } else if (valor !== "multipla_escolha" && valor !== "unica_escolha") {
        // Se não for um tipo com opções customizáveis, limpa as opções
        setOpcoes((prev) => ({ ...prev, [id]: [] }));
      }
    }
  };

  const adicionarOpcao = (perguntaId: string) => {
    const novaOpcaoId = uuidv4();

    setOpcoes((prevOpcoes) => {
      const novaOpcao: OpcaoResposta = {
        id: novaOpcaoId,
        id_pergunta: perguntaId,
        resposta: "",
        ordem: (prevOpcoes[perguntaId]?.length || 0) + 1,
        resposta_aberta: false,
      };
      return {
        ...prevOpcoes,
        [perguntaId]: [...(prevOpcoes[perguntaId] || []), novaOpcao],
      };
    });

    // Adicionar relação entre pergunta e opção de resposta
    const novaOpcaoRespostaPergunta: OpcaoRespostaPergunta = {
      id: uuidv4(),
      id_opcao_resposta: novaOpcaoId,
      id_pergunta: perguntaId,
    };

    setOpcoesRespostasPerguntas((prevOrp) => [
      ...prevOrp,
      novaOpcaoRespostaPergunta,
    ]);
  };

  const removerOpcao = (perguntaId: string, opcaoId: string) => {
    setOpcoes((prevOpcoes) => ({
      ...prevOpcoes,
      [perguntaId]: prevOpcoes[perguntaId].filter((o) => o.id !== opcaoId),
    }));

    // Remover condições relacionadas a esta opção
    setCondicoes((prevCondicoes) => {
      const novasCondicoes = { ...prevCondicoes };
      Object.keys(novasCondicoes).forEach((key) => {
        if (novasCondicoes[key].opcaoId === opcaoId) {
          delete novasCondicoes[key];
        }
      });
      return novasCondicoes;
    });

    // Remover relação entre pergunta e opção de resposta
    setOpcoesRespostasPerguntas((prevOrp) =>
      prevOrp.filter((orp) => orp.id_opcao_resposta !== opcaoId),
    );
  };

  const atualizarOpcao = (
    perguntaId: string,
    opcaoId: string,
    campo: keyof OpcaoResposta,
    valor: any,
  ) => {
    setOpcoes((prevOpcoes) => ({
      ...prevOpcoes,
      [perguntaId]: prevOpcoes[perguntaId].map((o) =>
        o.id === opcaoId ? { ...o, [campo]: valor } : o,
      ),
    }));
  };

  const definirCondicao = (
    perguntaId: string,
    perguntaCondicionalId: string,
    opcaoId: string,
  ) => {
    setCondicoes((prevCondicoes) => ({
      ...prevCondicoes,
      [perguntaId]: { perguntaId: perguntaCondicionalId, opcaoId },
    }));
  };

  const removerCondicao = (perguntaId: string) => {
    setCondicoes((prevCondicoes) => {
      const novasCondicoes = { ...prevCondicoes };
      delete novasCondicoes[perguntaId];
      return novasCondicoes;
    });
  };

  // Corrigindo a função onSubmit para seguir a sintaxe correta do shadcn/ui form
  const onSubmit = useCallback(
    (data: Formulario) => {
      // Adicionar o formulário ao contexto
      console.log("Dados do formulário:", data);
      adicionarFormulario(data);

      // Salvar as perguntas no contexto
      adicionarPerguntas(perguntas);

      // Salvar as opções de resposta
      const todasOpcoes: OpcaoResposta[] = [];
      Object.values(opcoes).forEach((opcoesArray) => {
        todasOpcoes.push(...opcoesArray);
      });
      adicionarOpcoesRespostas(todasOpcoes);

      // Salvar as relações entre perguntas e opções
      adicionarOpcoesRespostasPerguntas(opcoesRespostasPerguntas);

      // Salvar as condições de exibição das subperguntas
      adicionarCondicoesPerguntas(condicoes);

      alert("Formulário criado com sucesso!");
      setCreatedFormId(data.id);
    },
    [
      adicionarFormulario,
      adicionarPerguntas,
      adicionarOpcoesRespostas,
      adicionarOpcoesRespostasPerguntas,
      adicionarCondicoesPerguntas,
      perguntas,
      opcoes,
      opcoesRespostasPerguntas,
      condicoes,
    ],
  );

  return {
    form,
    perguntas,
    opcoes,
    opcoesRespostasPerguntas,
    createdFormId,
    condicoes,
    adicionarPergunta,
    removerPergunta,
    atualizarPergunta,
    adicionarOpcao,
    removerOpcao,
    atualizarOpcao,
    definirCondicao,
    removerCondicao,
    onSubmit,
  };
};
