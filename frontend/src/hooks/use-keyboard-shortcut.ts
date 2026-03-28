import { useEffect, useRef } from "react";

export const useKeyboardShortcut = (shortcutKeys: string[], callback: ()=>void) => {
    if (!Array.isArray(shortcutKeys))    
    throw new Error(      
        "The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings."    
    )

    if (!shortcutKeys.length)  
    throw new Error(    
        "The first parameter to `useKeyboardShortcut` must contain at least one `KeyboardEvent.key` string."  
    )

    if (!callback || typeof callback !== "function")  
    throw new Error(    
        "The second parameter to `useKeyboardShortcut` must be a function that will be invoked when the keys are pressed."  
    )

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase()

        if (shortcutKeys.map(k => k.toLowerCase()).includes(key)) {
          callback()
        }
      }

      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
  }, [shortcutKeys, callback])
}


