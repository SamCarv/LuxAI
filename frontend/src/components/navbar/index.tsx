import { LucideGithub, MessageSquare, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supportedLanguages, languagesMap} from './nav.constants'

const NavBar = () => {
    const [lightMode, setLighMode] = useState(true)
    const { i18n } = useTranslation()

    return (
        <nav className='flex w-full h-14 justify-between px-16 mt-4'>
            <ul className='bg-amber-100'></ul>
            <ul className='flex items-center justify-center gap-x-10'>
                <li className='cursor-pointer hover:bg-slate-300' onClick={()=>setLighMode(!lightMode)}>
                    {lightMode ? <Sun /> : <Moon />}
                </li>
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {i18n.language}
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
                </li>
                <li className='cursor-pointer hover:bg-slate-300'>
                    <a href="https://github.com/SamCarv/LuxAI/tree/main" target='./blank'>
                        <LucideGithub />
                    </a>
                </li>
                <li>
                    <MessageSquare />
                </li>
            </ul>
        </nav>
    )
}

export default NavBar