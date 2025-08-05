import { redirect } from "next/navigation";

/**
 * Componente da página inicial que redireciona para a página de criação de formulário.
 */
export default function HomePage() {
  redirect("/form/gerar");
}
