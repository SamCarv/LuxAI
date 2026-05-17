import React from 'react'

const ProfileSection = () => {
  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Perfil do Usuário</h3>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Nome de Exibição</label>
            <input type="text" className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="Carlos" />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Email</label>
            <input type='email' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="example@gmail.com" />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Old Password</label>
            <input type='password' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="******" />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">New Password</label>
            <input type='password' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="******" />
        </div>
    </div>
  )
}

export default ProfileSection