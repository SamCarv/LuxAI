import { X } from "lucide-react"
import Modal from "../modal"
import { userSettingsSections } from "./constants"
import SectionSideBar from "../sidebar/sidebar.section"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ProfileSection from "./sections/profile"
import AISection from "./sections/ai"
import SystemSection from "./sections/system"
import Section from "../section"
import { useShortcutContext } from "../../hooks/use-shortcut-context"
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut"

interface UserSettingsModal {
    onClose: () => void
} 

const UserSettingsModal = ({ onClose } : UserSettingsModal) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');

    const { pushShortcutContext, popShortcutContext } = useShortcutContext();
    
    useEffect(() => {
        pushShortcutContext("user_settings_modal");
        return () => popShortcutContext();
    }, []);

    useKeyboardShortcut({key: "Escape"}, () => onClose(), "user_settings_modal");

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSection />;
            case 'ai':
                return <AISection />;
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
        <Modal>
            <div className="flex justify-between items-center mb-6">
                <h1 className='heading-lg'>Configurações</h1>
                <button onClick={onClose} className="hover:bg-slate-200 rounded-full p-2 cursor-pointer transition ease-in text-slate-500">
                    <X size={24} />
                </button>
            </div>

            <div className="flex gap-8 min-h-100">
                <ul className="flex flex-col w-56 border-r border-slate-100 dark:border-zinc-600 pr-4">
                    {userSettingsSections.map((section) => (
                        <Section 
                            key={section.id}
                            icon={<section.icon size={20} />}
                            title={t(section.id)}
                            shortcut={{key: t(section.id.charAt(0))}}
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
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors cursor-pointer">
                    Cancelar
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-candy-corn-400 text-white dark:text-black rounded-md hover:bg-candy-corn-500 transition-colors cursor-pointer">
                    Salvar alterações
                </button>
            </div>
        </Modal>
    )
}

export default UserSettingsModal