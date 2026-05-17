import { useEffect } from "react";
import { useShortcutContext } from "./use-shortcut-context";

export type Shortcut = {
  key: string,
  ctrl?: boolean,
  shift?: boolean,
  alt?: boolean,
  meta?: boolean,
}


export const useKeyboardShortcut = (shortcut: Shortcut, callback: () => void, scope: string = 'main') => {
    const { activeShortcutContext } = useShortcutContext()
    
    if (!shortcut.key)  
      throw new Error(    
        "The first parameter to `useKeyboardShortcut` must contain at least one `KeyboardEvent.key` string."  
    )

    if (!callback || typeof callback !== "function")  
      throw new Error(    
        "The second parameter to `useKeyboardShortcut` must be a function that will be invoked when the keys are pressed."  
    )

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;

        if ( target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
        const isActiveContext = activeShortcutContext === scope

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch && isActiveContext) {
          event.preventDefault()
          callback()
        }
      }

      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      };
  }, [shortcut, callback])
}


