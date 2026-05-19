import { Github, MessageSquare, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supportedLanguages, languagesMap} from './constants'
import Button from '../button'
import { useThemeContext } from '../../hooks/use-theme-context'

const NavBar = () => {
    const {theme, switchTheme} = useThemeContext()
    const { i18n } = useTranslation()

    return (
        <nav className='flex w-full h-14 justify-end px-16 mt-4'>
            <ul className='flex items-center justify-center gap-x-10'>
                <li>
                    <Button variants='outline' colors='secondary' className='p-2 transition-none' onClick={() => switchTheme()}>
                        {theme === "light" ? <Sun /> : <Moon />}
                    </Button>
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
                <li>
                    <a href="https://github.com/SamCarv/LuxAI/tree/main" target='./blank'>
                        <Button variants='outline' colors='secondary' className='p-2'><Github /></Button>
                    </a>
                </li>
                <li>
                    <Button variants='outline' colors='secondary' className='p-2'>
                        <MessageSquare />
                    </Button>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar