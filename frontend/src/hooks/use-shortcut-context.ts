import { createContext, useContext } from "react";

interface ShortcutProps {
    pushShortcutContext: (name: string) => void
    popShortcutContext: () => void
    activeShortcutContext: string
}

export const ShortcutContext = createContext<ShortcutProps | null>(null);

export const useShortcutContext = () => {
    const context = useContext(ShortcutContext);
    
    if (!context) {
        throw new Error("useShortcutContext deve ser usado dentro de um ShortcutProvider");
    }
    
    return context;
};