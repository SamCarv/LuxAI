import { ChartNoAxesCombined, CreditCard, File, Flag, Home, HomeIcon, Icon, MessageCircle, MessageCircleIcon, MoreHorizontal, Phone, Sidebar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import SectionSideBar from './sidebar.section';
import { useLocation } from 'react-router-dom';

const SideBar = () => {
    const sections = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
        },
        {
            id: "planning",
            label: "Planejamento",
            icon: ChartNoAxesCombined,
        },
        {
            id: "investment",
            label: "Investimento",
            icon: Flag,
        },
        {
            id: "bank",
            label: "Banco",
            icon: CreditCard,
        },
        {
            id: "files",
            label: "Arquivos",
            icon: File,
        },
        {
            id: "chat",
            label: "Chat",
            icon: MessageCircle,
        }
    ]
    const location = useLocation()

  return (
    <div className='bg-slate-100 flex flex-col gap-y-16 w-66 h-full'>
        <section>
            <div className='flex items-center justify-between bg-slate-200/40 w-66 h-13 px-4'>
                <div className='flex gap-2'>
                    <img src="" alt="logo" />
                    <h1>LuxAI</h1>
                </div>
                <Sidebar className='flex w-6 h-6'/>
            </div>
        </section>
        <section className='flex-1'>
            {sections.map((section) =>  {
                const Icon = section.icon

                return (
                    <SectionSideBar 
                        key={section.id}
                        icon={<Icon/>}
                        title={section.label}
                        shortcut={[section.label.charAt(0).toLowerCase()]}
                        isActive={location.pathname === `/${section.id}`}
                        to={section.id}
                    />
                )
            })}
        </section>
        <section className='mt-auto'>
            <div className='flex justify-between bg-slate-200/40 w-66 h-13 px-4'>
                <div className='flex items-center justify-center gap-2'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>Nome</p>
                </div>  
                <MoreHorizontal className='self-center'/>
            </div>
        </section>
    </div>
  )
}

export default SideBar