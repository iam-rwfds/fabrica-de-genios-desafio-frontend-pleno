"use client";

import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useFormularios } from "~/contexts/formularios.context";
import type { Pergunta } from "~/entities/pergunta.entity";

export const useFormRenderer = () => {
  const params = useParams();
  const { formularios, perguntas, opcoesRespostas, condicoesPerguntas } =
    useFormularios();

  const [respostas, setRespostas] = useState<Record<string, any>>({});

  const formId = params.formId as string;

  const formulario = useMemo(
    () => formularios.find((f) => f.id === formId),
    [formularios, formId],
  );

  const perguntasDoFormulario = useMemo(
    () =>
      perguntas
        .filter((p) => p.id_formulario === formId)
        .sort((a, b) => a.ordem - b.ordem),
    [perguntas, formId],
  );

  const handleRespostaChange = useCallback((perguntaId: string, valor: any) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  }, []);

  const handleMultiplaEscolhaChange = useCallback(
    (perguntaId: string, opcaoId: string, checked: boolean) => {
      setRespostas((prev) => {
        const respostasAnteriores: string[] = prev[perguntaId] || [];
        if (checked) {
          return { ...prev, [perguntaId]: [...respostasAnteriores, opcaoId] };
        }
        return {
          ...prev,
          [perguntaId]: respostasAnteriores.filter((id) => id !== opcaoId),
        };
      });
    },
    [],
  );

  const isPerguntaVisivel = useCallback(
    (pergunta: Pergunta): boolean => {
      if (!pergunta.sub_pergunta) {
        return true;
      }
      const condicao = condicoesPerguntas[pergunta.id];
      if (!condicao) {
        return false;
      }

      const respostaPai = respostas[condicao.perguntaId];
      if (!respostaPai) {
        return false;
      }

      return Array.isArray(respostaPai)
        ? respostaPai.includes(condicao.opcaoId)
        : respostaPai === condicao.opcaoId;
    },
    [condicoesPerguntas, respostas],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Respostas enviadas:", respostas);
    alert(
      "Formulário respondido com sucesso! Verifique o console para ver os dados.",
    );
  };

  return {
    formulario,
    perguntasDoFormulario,
    opcoesRespostas,
    respostas,
    handleRespostaChange,
    handleMultiplaEscolhaChange,
    isPerguntaVisivel,
    handleSubmit,
  };
};
