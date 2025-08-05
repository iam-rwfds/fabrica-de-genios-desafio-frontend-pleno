"use client";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import type { Pergunta } from "~/entities/pergunta.entity";
import { useFormRenderer } from "./_hooks/use-form-renderer";

const Page = () => {
  const {
    formulario,
    perguntasDoFormulario,
    opcoesRespostas,
    respostas,
    handleRespostaChange,
    handleMultiplaEscolhaChange,
    isPerguntaVisivel,
    handleSubmit,
  } = useFormRenderer();

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
