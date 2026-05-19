import Button from "../../components/button";
import Input from "../../components/input";
import Panel from "../../components/panel";

interface RegisterFormProps {
    onClose: () => void
}

const RegisterForm = ({onClose}: RegisterFormProps) => {
  return (
    <Panel className="border-none shadow-2xl p-8 bg-white dark:bg-zinc-800">
        <h2 className="text-2xl font-bold text-center mb-8">Crie sua conta</h2>
        
        <form className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 dark:text-zinc-400">Nome Completo</label>
                <Input type="text" placeholder="Seu nome aqui" className="border-slate-200 dark:border-zinc-700" />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 dark:text-zinc-400">Email</label>
                <Input type="email" placeholder="nome@exemplo.com" className="border-slate-200 dark:border-zinc-700" />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 dark:text-zinc-400">Senha</label>
                <Input type="password" placeholder="••••••••" className="border-slate-200 dark:border-zinc-700" />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 dark:text-zinc-400">Confirmar Senha</label>
                <Input type="password" placeholder="••••••••" className="border-slate-200 dark:border-zinc-700" />
            </div>

            <Button variants="standard" colors="primary" className="w-full py-3.5 text-base mt-6">
                Criar conta agora
            </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-zinc-400 mt-6">
            Já tem uma conta? <button onClick={onClose} className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline cursor-pointer">Entrar</button>
        </p>
    </Panel>
  );
};

export default RegisterForm;