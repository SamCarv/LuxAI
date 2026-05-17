import React, { useState } from 'react';
import { ShortcutContext } from '../hooks/use-shortcut-context';

export const ShortcutProvider = ({children} :{ children: React.ReactNode}) => {
  const [stack, setStack] = useState(['main']);

  const pushShortcutContext = (name : string) => setStack(prev => [...prev, name]);
  const popShortcutContext = () => setStack(prev => prev.slice(0, -1));
  const activeShortcutContext = stack[stack.length - 1];

  return (
    <ShortcutContext.Provider value={{ activeShortcutContext, pushShortcutContext, popShortcutContext }}>
      {children}
    </ShortcutContext.Provider>
  );
};