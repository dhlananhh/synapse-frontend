"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import CommandMenu from "@/components/features/command/CommandMenu";

interface CommandMenuContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CommandMenuContext = createContext<CommandMenuContextType | undefined>(undefined);

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [ isOpen, setIsOpen ] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);


  return (
    <CommandMenuContext.Provider value={ { isOpen, setIsOpen } }>
      { children }
      <CommandMenu />
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) {
    throw new Error("useCommandMenu must be used within a CommandMenuProvider");
  }
  return context;
}
