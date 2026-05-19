import { useState } from "react";
import Button from "../../components/button";
import Input from "../../components/input";
import Label from "../../components/label";
import Panel from "../../components/panel";
import { useUserContext } from "../../hooks/use-user-context";
import { create_user } from "../../services/user";
import type { UserCreate } from "../../types/userDTO/userCreate";

interface RegisterFormProps {
    onClose: () => void
}

const RegisterForm = ({ onClose }: RegisterFormProps) => {
    const userContext = useUserContext()
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function register(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem!");
            return;
        }

        setIsLoading(true);

        const userCreate: UserCreate = {
            full_name: fullName,
            email: email,
            password: password,
            is_active: true,
            ai_provider: "ollama"
        }

        try {
            const response = await create_user(userCreate)
            const data = response.data

            if (!(response.status === 201 || 200)) {
                throw new Error(data.message || "Erro ao criar conta. Tente novamente.");
            }

            if (userContext) {
                userContext.setUser({
                    full_name: data.full_name || fullName,
                    email: data.email || email,
                    is_active: data.is_active ?? true,
                    ai_provider: data.ai_provider || "ollama"
                })
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Panel className="border-none p-8 bg-white dark:bg-zinc-800/60">
            <h2 className="text-2xl font-bold text-center mb-8">Crie sua conta</h2>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={register} className="space-y-4">
                <div className="space-y-1.5">
                    <Label>Nome Completo</Label>
                    <Input type="text" placeholder="Seu nome aqui" value={fullName} onChange={(e: any) => setFullName(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" placeholder="nome@exemplo.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                    <Label>Senha</Label>
                    <Input type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                    <Label>Confirmar Senha</Label>
                    <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} required />
                </div>

                <Button type="submit" variants="standard" colors="primary" className="w-full py-3.5 text-base mt-6 disabled:opacity-50" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar conta agora"}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-zinc-400 mt-6">
                Já tem uma conta? <button onClick={onClose} className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline cursor-pointer">Entrar</button>
            </p>
        </Panel>
    );
};

export default RegisterForm;