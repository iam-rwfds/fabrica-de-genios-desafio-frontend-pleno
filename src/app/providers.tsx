import type { ReactNode } from "react";
import { FormulariosProvider } from "~/contexts/formularios.context";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <FormulariosProvider>{children}</FormulariosProvider>;
};

export { Providers };
