import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import type { Formulario } from "~/entities/formulario.entity";
import type { OpcaoRespostaPergunta } from "~/entities/opcoes-resposta-pergunta.entity";
import type { OpcaoResposta } from "~/entities/opcoes-respostas.entity";
import type { Pergunta } from "~/entities/pergunta.entity";

// Definir tipo para condições
type CondicaoPergunta = {
  perguntaId: string;
  opcaoId: string;
};

type FormularioContextType = {
  formularios: Formulario[];
  opcoesRespostas: OpcaoResposta[];
  opcoesRespostasPerguntas: OpcaoRespostaPergunta[];
  perguntas: Pergunta[];
  condicoesPerguntas: Record<string, CondicaoPergunta>;
  adicionarFormulario: (formulario: Formulario) => void;
  adicionarPerguntas: (perguntasNovas: Pergunta[]) => void;
  adicionarOpcoesRespostas: (opcoesNovas: OpcaoResposta[]) => void;
  adicionarOpcoesRespostasPerguntas: (
    relacoes: OpcaoRespostaPergunta[],
  ) => void;
  adicionarCondicoesPerguntas: (
    condicoes: Record<string, CondicaoPergunta>,
  ) => void;
  responderFormulario: () => void;
};

const FormulariosContext = createContext<FormularioContextType>({
  formularios: [],
  opcoesRespostas: [],
  opcoesRespostasPerguntas: [],
  perguntas: [],
  condicoesPerguntas: {},
} as Partial<FormularioContextType> as FormularioContextType);

const FormulariosProvider = ({ children }: { children: ReactNode }) => {
  const [formularios, setFormularios] = useLocalStorage<Formulario[]>(
    "formularios",
    [],
  );
  const [opcoesRespostas, setOpcoesRespostas] = useLocalStorage<
    OpcaoResposta[]
  >("opcoesRespostas", []);
  const [opcoesRespostasPerguntas, setOpcoesRespostasPerguntas] =
    useLocalStorage<OpcaoRespostaPergunta[]>("opcoesRespostasPerguntas", []);
  const [perguntas, setPerguntas] = useLocalStorage<Pergunta[]>(
    "perguntas",
    [],
  );
  const [condicoesPerguntas, setCondicoesPerguntas] = useLocalStorage<
    Record<string, CondicaoPergunta>
  >("condicoesPerguntas", {});

  const adicionarFormulario = useCallback(
    (formulario: Formulario) => {
      setFormularios((prev) => [...prev, formulario]);
    },
    [setFormularios],
  );

  const adicionarPerguntas = useCallback(
    (perguntasNovas: Pergunta[]) => {
      setPerguntas((prev) => [...prev, ...perguntasNovas]);
    },
    [setPerguntas],
  );

  const adicionarOpcoesRespostas = useCallback(
    (opcoesNovas: OpcaoResposta[]) => {
      setOpcoesRespostas((prev) => [...prev, ...opcoesNovas]);
    },
    [setOpcoesRespostas],
  );

  const adicionarOpcoesRespostasPerguntas = useCallback(
    (relacoes: OpcaoRespostaPergunta[]) => {
      setOpcoesRespostasPerguntas((prev) => [...prev, ...relacoes]);
    },
    [setOpcoesRespostasPerguntas],
  );

  const adicionarCondicoesPerguntas = useCallback(
    (condicoes: Record<string, CondicaoPergunta>) => {
      setCondicoesPerguntas((prev) => ({ ...prev, ...condicoes }));
    },
    [setCondicoesPerguntas],
  );

  const responderFormulario = useCallback(() => {}, []);

  const valueMemo = useMemo(() => {
    return {
      formularios,
      opcoesRespostas,
      opcoesRespostasPerguntas,
      perguntas,
      condicoesPerguntas,
      adicionarFormulario,
      adicionarPerguntas,
      adicionarOpcoesRespostas,
      adicionarOpcoesRespostasPerguntas,
      adicionarCondicoesPerguntas,
      responderFormulario,
    };
  }, [
    formularios,
    opcoesRespostas,
    opcoesRespostasPerguntas,
    perguntas,
    condicoesPerguntas,
    adicionarFormulario,
    adicionarPerguntas,
    adicionarOpcoesRespostas,
    adicionarOpcoesRespostasPerguntas,
    adicionarCondicoesPerguntas,
    responderFormulario,
  ]);

  return (
    <FormulariosContext.Provider value={valueMemo}>
      {children}
    </FormulariosContext.Provider>
  );
};

const useFormularios = () => {
  const context = useContext(FormulariosContext);

  if (context === null) {
    throw new Error("useFormularios must be used within a FormulariosProvider");
  }

  return context;
};

export { FormulariosProvider, useFormularios };
