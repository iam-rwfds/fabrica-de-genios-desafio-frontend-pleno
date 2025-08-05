"use client";

import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useFormularios } from "~/contexts/formularios.context";
import type { Pergunta } from "~/entities/pergunta.entity";

const Page = () => {
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

  const handleRespostaChange = (perguntaId: string, valor: any) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  };

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

  const isPerguntaVisivel = (pergunta: Pergunta): boolean => {
    if (!pergunta.sub_pergunta) {
      return true;
    }
    const condicao = condicoesPerguntas[pergunta.id];
    if (!condicao) {
      // Se é uma sub-pergunta mas não tem condição, não deve ser visível.
      return false;
    }

    const respostaPai = respostas[condicao.perguntaId];
    if (!respostaPai) {
      return false;
    }

    if (Array.isArray(respostaPai)) {
      // Para múltipla escolha
      return respostaPai.includes(condicao.opcaoId);
    }
    // Para escolha única
    return respostaPai === condicao.opcaoId;
  };

  const renderInput = (pergunta: Pergunta) => {
    switch (pergunta.tipo_pergunta) {
      case "texto_livre":
        return (
          <Input
            type="text"
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
            required={pergunta.obrigatorio}
          />
        );
      case "inteiro":
        return (
          <Input
            type="number"
            step="1"
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
            required={pergunta.obrigatorio}
          />
        );
      case "numero_duas_casas_decimais":
        return (
          <Input
            type="number"
            step="0.01"
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
            required={pergunta.obrigatorio}
          />
        );
      case "sim_nao":
        return (
          <RadioGroup
            value={respostas[pergunta.id]}
            onValueChange={(value) => handleRespostaChange(pergunta.id, value)}
            required={pergunta.obrigatorio}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${pergunta.id}-sim`} />
              <Label htmlFor={`${pergunta.id}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${pergunta.id}-nao`} />
              <Label htmlFor={`${pergunta.id}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        );
      case "unica_escolha": {
        const opcoesDaPergunta = opcoesRespostas
          .filter((o) => o.id_pergunta === pergunta.id)
          .sort((a, b) => a.ordem - b.ordem);
        return (
          <RadioGroup
            value={respostas[pergunta.id]}
            onValueChange={(value) => handleRespostaChange(pergunta.id, value)}
            required={pergunta.obrigatorio}
          >
            {opcoesDaPergunta.map((opcao) => (
              <div key={opcao.id} className="flex items-center space-x-2">
                <RadioGroupItem value={opcao.id} id={opcao.id} />
                <Label htmlFor={opcao.id}>{opcao.resposta}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      }
      case "multipla_escolha": {
        const opcoesDaPergunta = opcoesRespostas
          .filter((o) => o.id_pergunta === pergunta.id)
          .sort((a, b) => a.ordem - b.ordem);
        return (
          <div className="space-y-2">
            {opcoesDaPergunta.map((opcao) => (
              <div key={opcao.id} className="flex items-center space-x-2">
                <Checkbox
                  id={opcao.id}
                  checked={(respostas[pergunta.id] || []).includes(opcao.id)}
                  onCheckedChange={(checked) =>
                    handleMultiplaEscolhaChange(
                      pergunta.id,
                      opcao.id,
                      !!checked,
                    )
                  }
                />
                <Label htmlFor={opcao.id}>{opcao.resposta}</Label>
              </div>
            ))}
          </div>
        );
      }
      default:
        return <p>Tipo de pergunta não suportado.</p>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Respostas enviadas:", respostas);
    alert(
      "Formulário respondido com sucesso! Verifique o console para ver os dados.",
    );
    // Aqui você normalmente enviaria o objeto `respostas` para um servidor
  };

  if (!formulario) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Formulário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{formulario.titulo}</h1>
        {formulario.descricao && (
          <p className="text-muted-foreground">{formulario.descricao}</p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {perguntasDoFormulario.map((pergunta) => {
          if (!isPerguntaVisivel(pergunta)) {
            return null;
          }

          return (
            <div
              key={pergunta.id}
              className="p-4 border rounded-lg bg-card shadow-sm"
            >
              <Label className="text-base font-semibold block mb-2">
                {pergunta.titulo}
                {pergunta.obrigatorio && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              {pergunta.orientacao_resposta && (
                <p className="text-sm text-muted-foreground mb-4">
                  {pergunta.orientacao_resposta}
                </p>
              )}
              {renderInput(pergunta)}
            </div>
          );
        })}

        <Button type="submit" className="w-full">
          Enviar Respostas
        </Button>
      </form>
    </div>
  );
};

export default Page;
