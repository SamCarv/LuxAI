import type { Dispatch, SetStateAction } from "react"
import type { UserUpdate } from "../../../../types/user";

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
            <label className="text-sm font-medium text-slate-700 dark:text-white">Antiga Password</label>
            <input type='password' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="******" value={settings.password} onChange={(password) => setSettings({...settings, password: password.target.value})} />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-white">Nova Password</label>
            <input type='password' className="border rounded-md p-2 w-full outline-candy-corn-400 dark:bg-zinc-800" placeholder="******" />
        </div>
    </div>
  );
};

export default ProfileSection;