import { X } from "lucide-react"
import Modal from "../modal"
import { userSettingsSections } from "./constants"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ProfileSection from "./sections/profile"
import AISection from "./sections/ai"
import SystemSection from "./sections/system"
import Section from "../section"
import { useShortcutContext } from "../../hooks/use-shortcut-context"
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut"
import Button from "../button"
import { useUserContext } from "../../hooks/use-user-context"
import type { UserView } from "../../context/user-provider"
import type { UserUpdate } from "../../types/userDTO/userUpdate"
import { update_user } from "../../services/user"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

interface UserSettingsModal {
    onClose: () => void
}

const UserSettingsModal = ({ onClose }: UserSettingsModal) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    const {user} = useUserContext();
    const [settings, setSettings] = useState<UserUpdate>({
        full_name: user!.full_name,
        email: user!.email,
        password: "",
        ai_provider: user?.ai_provider || "gemini",
        is_active: user!.is_active,
        google_api_key: "",
    });
    const { pushShortcutContext, popShortcutContext } = useShortcutContext();

    useEffect(() => {
        pushShortcutContext("user_settings_modal");
        return () => popShortcutContext();
    }, []);

    useKeyboardShortcut({ key: "Escape" }, () => onClose(), "user_settings_modal");

    const sendSettings = async() => {
        try {
            const token = localStorage.getItem("token")
                        
            if(!token) {
                console.log("Not get token")
                return
            }

            const decodedJwt = jwtDecode(token)
            const id = decodedJwt.sub
            if(!id) {
                console.log("Not get user_id")
                return
            }

            await update_user(id, settings)
            toast.success("Alteração com sucesso!")
        } catch (error) {
            console.log(error);
            toast.error("Erro ao atualizar os dados!")
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSection settings={settings} setSettings={setSettings}/>;
            case 'ai':
                return <AISection settings={settings} setSettings={setSettings}/>;
            case 'system':
                return <SystemSection />;
            case 'notification':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Notificações</h3>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span>Notificações por E-mail</span>
                            <input type="checkbox" className="accent-candy-corn-500 size-4" />
                        </div>
                    </div>
                );
        }
    }

    return (
        <Modal className="lg:max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className='heading-lg'>Configurações</h1>
                <button onClick={onClose} className="hover:bg-slate-200 rounded-full p-2 cursor-pointer transition ease-in text-slate-500">
                    <X size={24} />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 min-h-100">
                <ul className="flex flex-row lg:flex-col w-full lg:w-56 border-r border-slate-100 dark:border-zinc-600 pr-4">
                    {userSettingsSections.map((section) => (
                        <Section
                            key={section.id}
                            icon={<section.icon size={20} />}
                            title={t(section.id)}
                            shortcut={{ key: t(section.id.charAt(0)) }}
                            isActive={activeTab === section.id}
                            scope="user_settings_modal"
                            onClick={() => setActiveTab(section.id)}
                        />
                    ))}
                </ul>

                <div className="flex-1 overflow-y-auto px-2">
                    {renderContent()}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-44 pt-4 h border-t border-slate-100 dark:border-zinc-600">
                <Button variants="standard" colors="secondary" onClick={onClose} className="text-sm font-medium">
                    Cancelar
                </Button>
                <Button variants="standard" colors="primary" className="text-sm font-medium" onClick={sendSettings}>
                    Salvar alterações
                </Button>
            </div>
        </Modal>
    )
}

export default UserSettingsModal