import { Bolt, Menu, Sidebar, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import SectionSideBar from './section';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import { sections } from './constants'
import logo from '../../assets/logo.svg'
import { useState } from 'react';
import UserSettingsModal from '../user-settings-modal';
import { useKeyboardShortcut } from '../../hooks/use-keyboard-shortcut';
import Button from '../button';
import { useUserContext } from '../../hooks/use-user-context';

const SideBar = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isHideSidebar, setIsHideSidebar] = useState(false);
    const [isOpenSettingsModal, setIsOpenModal] = useState(false);
    const currentSection = sections.find(s => location.pathname.startsWith(`/${s.id}`));
    const sectionTitle = currentSection ? t(currentSection.id) : 'No Section Selected';
    const { user } = useUserContext(); user
    useKeyboardShortcut({key: "s"}, () => setIsOpenModal(!isOpenSettingsModal))
    useKeyboardShortcut({key: "h"}, () => setIsHideSidebar(!isHideSidebar))

    return (
        <>
            <nav className="lg:hidden fixed top-0 left-0 w-full h-16 bg-smoke-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 px-4 flex items-center justify-between z-50">
                <a className='flex gap-2 items-center' href='/'>
                    <img className='size-8 rounded-md' src={logo} alt="logo" />
                </a>
                
                <h2 className="text-slate-700 dark:text-zinc-200 font-semibold text-lg">{sectionTitle}</h2>

                <button 
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                    className="p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                    {isOpenMenu ? <X size={28} /> : <Menu size={28} />}
                </button>

                {isOpenMenu && (
                    <div className="absolute top-16 left-0 w-full h-screen bg-smoke-100 dark:bg-zinc-950 z-40 p-4 animate-in slide-in-from-top duration-300">
                        <ul className='space-y-2'>
                            {sections.map((section) => (
                                <SectionSideBar 
                                    key={section.id}
                                    icon={<section.icon size={22} />}
                                    title={t(section.id)}
                                    isActive={location.pathname.startsWith(`/${section.id}`)}
                                    shortcut={{key: t(section.id.charAt(0))}}
                                    to={section.id}
                                />
                            ))}
                        </ul>
                        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800">
                            <Button
                                variants='outline'
                                colors='secondary'
                                onClick={() => {setIsOpenModal(true); setIsOpenMenu(false)}} className="gap-3 p-3"
                            >
                                <Avatar className='h-9 w-9'>
                                    <AvatarImage src="https://github.com/fernando-cruz-cavina.png" />
                                    <AvatarFallback>N</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-700 dark:text-zinc-300">Configurações</span>
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            <nav className={`hidden sticky top-0 lg:flex flex-col bg-smoke-100 dark:bg-zinc-950 h-screen border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 z-30 ${isHideSidebar ? 'w-24' : 'w-66'}`}>
                <section>
                    <div className={`flex items-center justify-between bg-slate-200/40 dark:bg-zinc-900/40 w-full h-13 px-4 ${isHideSidebar && 'flex-col py-4 gap-4 h-fit'}`}>
                        <a className='flex gap-2 items-center' href='/'>
                            <img className='size-8 rounded-md' src={logo} alt="logo" />  
                            {!isHideSidebar && <h1 className='heading-md dark:text-white'>LuxAI</h1>}
                        </a>
                        <Button variants='outline' colors='secondary' onClick={() => setIsHideSidebar(!isHideSidebar)} className='size-8'>
                            <Sidebar size={20}/>
                        </Button>
                    </div>
                </section>

                <section className='flex-1 overflow-y-auto py-8'>
                    <ul className='space-y-1'>
                        {sections.map((section) => (
                            <SectionSideBar 
                                key={section.id}
                                icon={<section.icon size={22} />}
                                title={t(section.id)}
                                isActive={location.pathname.startsWith(`/${section.id}`)}
                                shortcut={{key: t(section.id.charAt(0)), ctrl: false, alt: false}}
                                to={section.id}
                                isCollapsed={isHideSidebar}
                            />
                        ))}
                    </ul>
                </section>

                <section className='mt-auto border-t border-slate-200 dark:border-zinc-800'>
                    <Button
                        variants='outline'
                        colors='secondary' 
                        onClick={() => setIsOpenModal(true)}  
                        className={`w-full h-16 px-4 rounded-none  ${isHideSidebar ? 'justify-center' : 'justify-between'}`}
                    >
                        <div className='flex items-center gap-3'>
                            <Avatar className='h-9 w-9 border border-zinc-200 dark:border-zinc-700'>
                                <AvatarImage src="https://github.com/fernando-cruz-cavina.png" />
                                <AvatarFallback className="dark:bg-zinc-800 dark:text-zinc-200">{user?.full_name?.charAt(0) || "N"}</AvatarFallback>
                            </Avatar>
                            {!isHideSidebar && <p className='font-medium text-sm text-slate-700 dark:text-zinc-300'>{user?.full_name || "Nome"}</p>}
                        </div>  
                        {!isHideSidebar && <Bolt className='text-slate-400 dark:text-zinc-500 hover:text-yellow-500 transition-colors' size={18}/>}
                    </Button>
                </section>
            </nav>

            {isOpenSettingsModal && <UserSettingsModal onClose={() => setIsOpenModal(false)}/>}
        </>
    );
};

export default SideBar;