import { useState, type FormEvent } from "react"
import Button from "../../components/button"
import Input from "../../components/input"
import Label from "../../components/label"
import Panel from "../../components/panel"
import type { UserLogin } from "../../types/authDTO/userLogin"
import { useUserContext } from "../../hooks/use-user-context"
import { login_for_access_token } from "../../services/auth"

interface LoginFormProps {
    onClose: () => void
}

const LoginForm = ({ onClose }: LoginFormProps) => {
    const userContext = useUserContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function login(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        const userLogin: UserLogin = {
            username: email,
            password: password
        };

        try {
            const response = await login_for_access_token(userLogin);
            const data = response.data;

            if (!(response.status === 200)) {
                throw new Error(data.message || "Email ou senha incorretos.");
            }

            if (userContext) {
                userContext.setUser({
                    full_name: data.full_name,
                    email: data.email,
                    is_active: data.is_active ?? true,
                    ai_provider: data.ai_provider || "ollama"
                });
            }

            onClose();
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } {
            setIsLoading(false);
        }
    }

    return (
        <Panel className="border-none p-8 bg-white dark:bg-zinc-800/60">
            <h2 className="text-2xl font-bold text-center mb-8">Bem-vindo de volta</h2>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={login} className="space-y-5">
                <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" placeholder="nome@exemplo.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <Label>Senha</Label>
                        <a href="#" className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline">Esqueceu a senha?</a>
                    </div>
                    <Input type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
                </div>

                <Button variants="standard" colors="primary" className="w-full py-3.5 text-base mt-6 disabled:opacity-50">
                    {isLoading ? "Entrando..." : "Entrar na Conta"}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-zinc-400 mt-6">
                Não tem uma conta? <button onClick={onClose} className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline cursor-pointer">Criar agora</button>
            </p>
        </Panel>
    )
}

export default LoginForm