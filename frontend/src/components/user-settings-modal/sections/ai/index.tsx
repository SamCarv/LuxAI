import type { Dispatch, SetStateAction } from "react"
import type { UserUpdate } from "../../../../types/userDTO/userUpdate"

interface AISectionProps {
    settings: UserUpdate
    setSettings: Dispatch<SetStateAction<UserUpdate>>
}

const AISection = ({settings, setSettings}: AISectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inteligência Artificial</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white">Provedor</label>
        <select className="border rounded-md p-2 w-full outline-candy-corn-400 bg-white dark:bg-zinc-800" defaultValue={'google'} onChange={(ai_provider) => setSettings({...settings, ai_provider: ai_provider.target.value})}>
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
  );
};

export default AISection;