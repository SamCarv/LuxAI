import { LucideGithub, MessageSquare, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supportedLanguages, languagesMap} from './navigation.constants'

const Navigation = () => {
    const [lightMode, setLighMode] = useState(true)
    const { i18n } = useTranslation()

    return (
        <nav className='flex w-full h-14 justify-between px-16 mt-4'>
            <section className='bg-amber-100'></section>
            <section className='flex items-center justify-center gap-x-10'>
                <button className='cursor-pointer hover:bg-slate-300' onClick={()=>setLighMode(!lightMode)}>
                    {lightMode ? <Sun /> : <Moon />}
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className='cursor-pointer hover:bg-slate-300'>{i18n.language}</button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Select language</DropdownMenuLabel>
                            {supportedLanguages.map(language =>(
                                <DropdownMenuItem
                                key={language}
                                onClick={() => i18n.changeLanguage(language)}
                                >
                                {languagesMap[language] || language}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <button className='cursor-pointer hover:bg-slate-300'>
                    <LucideGithub />
                </button>
                <MessageSquare />
            </section>
        </nav>
    )
}

export default Navigation