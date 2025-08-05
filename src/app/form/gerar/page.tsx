"use client";

import { Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { TipoPergunta } from "~/entities/pergunta.entity";
import { useFormGenerator } from "./_hooks/use-form-generator";

const Page = () => {
  const {
    onSubmit,
    form,
    perguntas,
    removerPergunta,
    atualizarPergunta,
    opcoes,
    condicoes,
    removerCondicao,
    atualizarOpcao,
    definirCondicao,
    adicionarOpcao,
    removerOpcao,
    adicionarPergunta,
    createdFormId,
  } = useFormGenerator();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Criar novo formulário</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do formulário</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título do formulário"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a descrição do formulário"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border rounded-md p-4">
            <h2 className="text-xl font-semibold mb-4">Perguntas</h2>

            {perguntas.length === 0 && (
              <p className="text-muted-foreground mb-4">
                Nenhuma pergunta adicionada. Clique no botão abaixo para
                adicionar.
              </p>
            )}

            {perguntas.map((pergunta, index) => (
              <div key={pergunta.id} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Pergunta {index + 1}</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removerPergunta(pergunta.id)}
                  >
                    Remover
                  </Button>
                </div>

                <div className="grid gap-4 mb-4">
                  <div>
                    <FormLabel htmlFor={`titulo-${pergunta.id}`}>
                      Título da pergunta
                    </FormLabel>
                    <Input
                      className="mt-2"
                      id={`titulo-${pergunta.id}`}
                      value={pergunta.titulo}
                      onChange={(e) =>
                        atualizarPergunta(pergunta.id, "titulo", e.target.value)
                      }
                      placeholder="Digite o título da pergunta"
                    />
                  </div>

                  <div>
                    <FormLabel htmlFor={`codigo-${pergunta.id}`}>
                      Código
                    </FormLabel>
                    <Input
                      className="mt-2"
                      id={`codigo-${pergunta.id}`}
                      value={pergunta.codigo}
                      onChange={(e) =>
                        atualizarPergunta(pergunta.id, "codigo", e.target.value)
                      }
                      placeholder="Digite o código da pergunta"
                    />
                  </div>

                  <div>
                    <FormLabel htmlFor={`orientacao-${pergunta.id}`}>
                      Orientação
                    </FormLabel>
                    <Input
                      className="mt-2"
                      id={`orientacao-${pergunta.id}`}
                      value={pergunta.orientacao_resposta}
                      onChange={(e) =>
                        atualizarPergunta(
                          pergunta.id,
                          "orientacao_resposta",
                          e.target.value,
                        )
                      }
                      placeholder="Digite a orientação para resposta"
                    />
                  </div>

                  <div>
                    <FormLabel htmlFor={`tipo-${pergunta.id}`}>
                      Tipo de pergunta
                    </FormLabel>
                    <Select
                      value={pergunta.tipo_pergunta}
                      onValueChange={(value) =>
                        atualizarPergunta(
                          pergunta.id,
                          "tipo_pergunta",
                          value as TipoPergunta,
                        )
                      }
                    >
                      <SelectTrigger
                        className="mt-2"
                        id={`tipo-${pergunta.id}`}
                      >
                        <SelectValue placeholder="Selecione o tipo de pergunta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="texto_livre">
                            Texto livre
                          </SelectItem>
                          <SelectItem value="sim_nao">Sim/Não</SelectItem>
                          <SelectItem value="multipla_escolha">
                            Múltipla escolha
                          </SelectItem>
                          <SelectItem value="unica_escolha">
                            Única escolha
                          </SelectItem>
                          <SelectItem value="inteiro">
                            Número inteiro
                          </SelectItem>
                          <SelectItem value="numero_duas_casas_decimais">
                            Número decimal
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`obrigatorio-${pergunta.id}`}
                      checked={pergunta.obrigatorio}
                      onCheckedChange={(checked) =>
                        atualizarPergunta(pergunta.id, "obrigatorio", !!checked)
                      }
                    />
                    <FormLabel htmlFor={`obrigatorio-${pergunta.id}`}>
                      Obrigatória
                    </FormLabel>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`subpergunta-${pergunta.id}`}
                      checked={pergunta.sub_pergunta}
                      onCheckedChange={(checked) =>
                        atualizarPergunta(
                          pergunta.id,
                          "sub_pergunta",
                          !!checked,
                        )
                      }
                    />
                    <FormLabel htmlFor={`subpergunta-${pergunta.id}`}>
                      Sub-pergunta
                    </FormLabel>
                  </div>

                  {/* Condições para exibição da pergunta */}
                  {pergunta.sub_pergunta && (
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-medium mb-2">Condição de exibição</h4>

                      {condicoes[pergunta.id] ? (
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm">
                              Exibir quando a pergunta{" "}
                              {perguntas.find(
                                (p) =>
                                  p.id === condicoes[pergunta.id].perguntaId,
                              )?.titulo || ""}{" "}
                              for respondida com a opção{" "}
                              {opcoes[condicoes[pergunta.id].perguntaId]?.find(
                                (o) => o.id === condicoes[pergunta.id].opcaoId,
                              )?.resposta || ""}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removerCondicao(pergunta.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          <FormLabel>
                            Selecione a pergunta condicional
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const perguntaCondicionalId = value;
                              if (opcoes[perguntaCondicionalId]?.length > 0) {
                                definirCondicao(
                                  pergunta.id,
                                  perguntaCondicionalId,
                                  opcoes[perguntaCondicionalId][0].id,
                                );
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma pergunta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {perguntas
                                  .filter(
                                    (p) =>
                                      p.id !== pergunta.id &&
                                      (p.tipo_pergunta === "multipla_escolha" ||
                                        p.tipo_pergunta === "unica_escolha" ||
                                        p.tipo_pergunta === "sim_nao"),
                                  )
                                  .map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.titulo}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          {condicoes[pergunta.id] && (
                            <>
                              <FormLabel>
                                Selecione a opção de resposta
                              </FormLabel>
                              <Select
                                value={condicoes[pergunta.id].opcaoId}
                                onValueChange={(value) =>
                                  definirCondicao(
                                    pergunta.id,
                                    condicoes[pergunta.id].perguntaId,
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {opcoes[
                                      condicoes[pergunta.id].perguntaId
                                    ]?.map((opcao) => (
                                      <SelectItem
                                        key={opcao.id}
                                        value={opcao.id}
                                      >
                                        {opcao.resposta}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Opções de resposta para perguntas de múltipla ou única escolha */}
                  {(pergunta.tipo_pergunta === "multipla_escolha" ||
                    pergunta.tipo_pergunta === "unica_escolha") && (
                    <div className="border-t pt-4 mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Opções de resposta</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adicionarOpcao(pergunta.id)}
                        >
                          Adicionar opção
                        </Button>
                      </div>

                      {opcoes[pergunta.id]?.length === 0 && (
                        <p className="text-muted-foreground text-sm mb-2">
                          Nenhuma opção adicionada.
                        </p>
                      )}

                      {opcoes[pergunta.id]?.map((opcao, opcaoIndex) => (
                        <div
                          key={opcao.id}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Input
                            value={opcao.resposta}
                            onChange={(e) =>
                              atualizarOpcao(
                                pergunta.id,
                                opcao.id,
                                "resposta",
                                e.target.value,
                              )
                            }
                            placeholder={`Opção ${opcaoIndex + 1}`}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`resposta-aberta-${opcao.id}`}
                              checked={opcao.resposta_aberta}
                              onCheckedChange={(checked) =>
                                atualizarOpcao(
                                  pergunta.id,
                                  opcao.id,
                                  "resposta_aberta",
                                  !!checked,
                                )
                              }
                            />
                            <FormLabel
                              htmlFor={`resposta-aberta-${opcao.id}`}
                              className="whitespace-nowrap"
                            >
                              Resposta aberta
                            </FormLabel>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerOpcao(pergunta.id, opcao.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Opções para perguntas do tipo Sim/Não */}
                  {pergunta.tipo_pergunta === "sim_nao" && (
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-medium mb-2">Opções de resposta</h4>
                      <div className="flex flex-col gap-2">
                        <RadioGroup
                          defaultValue="sim"
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="sim"
                              id={`sim-${pergunta.id}`}
                            />
                            <FormLabel htmlFor={`sim-${pergunta.id}`}>
                              Sim
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="nao"
                              id={`nao-${pergunta.id}`}
                            />
                            <FormLabel htmlFor={`nao-${pergunta.id}`}>
                              Não
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={adicionarPergunta}
              className="w-full"
            >
              Adicionar pergunta
            </Button>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Salvar formulário</Button>
          </div>
        </form>
      </Form>

      {createdFormId && (
        <div className="mt-6 p-4 border rounded-lg bg-muted flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-muted-foreground">
              Link para o seu formulário:
            </p>
            <a
              href={`/form/${createdFormId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline break-all"
            >
              {typeof window !== "undefined" &&
                `${window.location.origin}/form/${createdFormId}`}
            </a>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              const link = `${window.location.origin}/form/${createdFormId}`;
              navigator.clipboard.writeText(link).then(() => {
                alert("Link copiado para a área de transferência!");
              });
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
