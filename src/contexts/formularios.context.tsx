import { createContext, type ReactNode, useContext } from "react";

const FormulariosContext = createContext({});

const FormulariosProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FormulariosContext.Provider value={{}}>
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
