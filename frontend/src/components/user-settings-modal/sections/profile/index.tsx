import type { Dispatch, SetStateAction } from "react"
import type { UserUpdate } from "../../../../types/userDTO/userUpdate"

interface ProfileSectionProps {
    settings: UserUpdate
    setSettings: Dispatch<SetStateAction<UserUpdate>>
}
const ProfileSection = ({settings, setSettings}: ProfileSectionProps) => {
  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Perfil do Usuário</h3>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Nome de Exibição</label>
            <input type="text" className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="Carlos" value={settings.full_name} onChange={(name) => setSettings({...settings, full_name: name.target.value})} />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Email</label>
            <input type='email' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="example@gmail.com" value={settings.email} onChange={(email) => setSettings({...settings, email: email.target.value})}/>
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Old Password</label>
            <input type='password' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="******" value={settings.password} onChange={(password) => setSettings({...settings, password: password.target.value})} />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">New Password</label>
            <input type='password' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="******" />
        </div>
        <h3 className="text-lg font-semibold">Inteligência Artificial</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Provedor</label>
        <select className="border rounded-md p-2 w-full outline-candy-corn-400 bg-white dark:bg-zinc-800" value={'google'} onChange={(ai_provider) => setSettings({...settings, ai_provider: ai_provider.target.value})}>
          <option value="ollama">Ollama (Local)</option>
          <option value="google">Google Gemini (Online)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Chave API do provedor</label>
        <input 
          type="password" 
          className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" 
          placeholder="sk-..."
          onChange={(api_key) => setSettings({...settings, google_api_key: api_key.target.value})}
        />
      </div>
    </div>
  )
}

export default ProfileSection