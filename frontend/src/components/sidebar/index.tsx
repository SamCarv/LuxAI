import { MoreHorizontal, Sidebar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import SectionSideBar from './sidebar.section';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import { sections } from './sidebar.constants'
import iconX from '../../assets/icon-x.svg'

const SideBar = () => {
    const location = useLocation()
    const { t } = useTranslation()

    return (
        <nav className='bg-slate-100 flex flex-col gap-y-16 w-66 h-full'>
            <section>
                <div className='flex items-center justify-between bg-slate-200/40 w-66 h-13 px-4'>
                    <div className='flex gap-2 items-center'>
                        <img className='w-8 h-8' src={iconX} alt="logo" />
                        <h1 className=''><a href="/">LuxAI</a></h1>
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
                            title={t(section.id)}
                            shortcut={[t(section.id.charAt(0))]}
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
        </nav>
    )
}

export default SideBar