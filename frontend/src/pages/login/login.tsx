import { useState, type FormEvent } from "react"
import Button from "../../components/button"
import Input from "../../components/input"
import Label from "../../components/label"
import Panel from "../../components/panel"
import type { UserLogin } from "../../types/auth"
import { login_for_access_token } from "../../services/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface LoginFormProps {
    onClose: () => void
}

const LoginForm = ({ onClose }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate()

    async function login(event: FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        const userLogin: UserLogin = {
            username: email,
            password: password
        };

        try {
            const loginResponse = await login_for_access_token(userLogin);
            const tokenData = loginResponse.data;

            if (!(loginResponse.status === 200)) {
                throw new Error(tokenData.message);
            }

            const token = loginResponse.data.access_token;
            localStorage.setItem("token", token);

            nav("/dashboard")
        } catch (err: any) {
            toast.error("Erro no login! Email ou senha está errado", {duration: 3000})
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Panel className="border-none p-8 bg-white dark:bg-zinc-800/60">
            <h2 className="text-2xl font-bold text-center mb-8">Bem-vindo de volta</h2>

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