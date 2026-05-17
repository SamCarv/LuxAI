import React from 'react'

const SystemSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sistema</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Linguagem</label>
        <select className="border rounded-md p-2 w-full outline-candy-corn-400 bg-white dark:bg-zinc-800">
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Tema</label>
        <select className="border rounded-md p-2 w-full outline-candy-corn-400 bg-white dark:bg-zinc-800">
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="system">Sistema</option>
        </select>
      </div>
    </div>
  )
}

export default SystemSection