type TipoPergunta =
	| "sim_nao"
	| "multipla_escolha"
	| "unica_escolha"
	| "texto_livre"
	| "inteiro"
	| "numero_duas_casas_decimais";

type Pergunta = {
	id: string;
	id_formulario: string;
	titulo: string;
	codigo: string;
	orientacao_resposta: string;
	ordem: number;
	obrigatorio: boolean;
	sub_pergunta: boolean;
	tipo_pergunta: TipoPergunta;
};

export type { Pergunta, TipoPergunta };
