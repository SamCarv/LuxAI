import { Sun, Github, AlertTriangle, TrendingUp, BarChart3, PersonStanding, Moon } from 'lucide-react';
import Button from '../../components/button';
import InsightCard from '../../components/insight-card';
import { useState } from 'react';
import LoginForm from './login';
import RegisterForm from './register';
import logo from '../../assets/logo.svg'
import { useThemeContext } from '../../hooks/use-theme-context';
import { Toaster } from 'sonner';

const Login = () => {
    const {theme, switchTheme} = useThemeContext()
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(true);

    return (
        <div className="min-h-screen w-full bg-smoke-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
            <header className="container mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <img src={logo} className='size-8 rounded-md' />
                    <span className="text-2xl font-bold">Lux<span className="font-light">AI</span></span>
                </div>

                <div className="flex items-center gap-4">
                    <Button variants="ghost" colors="secondary" className="text-sm px-4 py-2">Entrar</Button>
                    <Button variants="standard" colors="primary" className="text-sm">Começar Agora</Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="space-y-12">
                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter">
                        Gerencie suas finanças com <span className="text-yellow-500 dark:text-yellow-400">clareza inteligente.</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-zinc-400">
                        Acesse o LuxAI e converse com o seu Assistente Pessoal para receber orientação e automação de organização financeira
                    </p>
                </div>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold">Insights em Tempo Real</h2>
                    <div className="grid grid-cols-1 grid-rows-3 gap-6">
                    <InsightCard 
                        icon={<BarChart3 size={24} className="text-green-600" />} 
                        title="Economia Mensal" 
                        value="+15.3%" 
                        color="bg-green-100 dark:bg-green-950" 
                    />
                    <InsightCard 
                        icon={<TrendingUp size={24} className="text-amber-600" />} 
                        title="Gastos com Lazer" 
                        value="+18%" 
                        color="bg-amber-100 dark:bg-amber-950" 
                    />
                    <InsightCard 
                        icon={<AlertTriangle size={24} className="text-red-600" />} 
                        title="Alerta de Orçamento" 
                        value="+2%" 
                        color="bg-red-100 dark:bg-red-950" 
                    />
                    </div>
                </section>
                </div>

                <div className="w-full max-w-md mx-auto md:mx-0 place-self-center">
                    {isLoginFormOpen ? <LoginForm onClose={() => setIsLoginFormOpen(false)}/> : <RegisterForm onClose={() => setIsLoginFormOpen(true)}/>}
                </div>
            </main>

            <footer className="container mx-auto px-6 py-8 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
                <p>&copy; 2026 LuxAI. Todos os direitos reservados.</p>
                <div className="flex items-center gap-6">
                    <Button variants='outline' colors='secondary' className="body-sm flex items-center p-2 gap-2" onClick={() => switchTheme()}>
                        {theme === "light" ? <Sun size={24} /> : <Moon size={24}/>} Tema
                    </Button>
                    <Button variants='outline' colors='secondary' className="body-sm flex items-center p-2 gap-1.5">
                        <PersonStanding />PT-BR
                    </Button>
                    <a href="https://github.com/SamCarv/LuxAI/tree/main"  target='./blank' >
                        <Button variants='outline' colors='secondary' className='p-2'><Github size={24}/></Button>
                    </a>
                </div>
            </footer>
            <Toaster richColors position='top-center'/>
        </div>
    );
};

export default Login;