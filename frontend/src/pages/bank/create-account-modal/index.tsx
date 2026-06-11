import { useState, type FC, type FormEvent } from "react";
import { type AccountType, type AccountView, type CreateAccount } from "../../../types/account";
import { create_bank_account } from "../../../services/account";
import Modal from "../../../components/modal";
import Input from "../../../components/input";
import Button from "../../../components/button";
import Label from "../../../components/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InputMoney from "../../../components/input/input-money";

interface CreateAccountModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAccountModal: FC<CreateAccountModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState<string>("")
  const [balance, setBalance] = useState<number>(0)
  const [currency, setCurrency] = useState<string>("BRL")
  const [account_type, setAccount_type] = useState<AccountType>('CHECKING')
  const queryClient = useQueryClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccountMutation = useMutation({
    mutationFn: (createAccount: CreateAccount) => create_bank_account(createAccount),
    onSuccess: (newAccountCreated) => {
      queryClient.setQueryData(['accounts'], (oldAccountList: AccountView[]) => {
        return oldAccountList? [...oldAccountList, newAccountCreated] : [newAccountCreated]
      })
      toast.success(`Sua conta ${newAccountCreated.name} foi criada!`)
    },
    onError: () => {
      toast.error('Não foi possível criar sua conta.')
    }
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      createAccountMutation.mutate({name, balance, account_type, currency});

      if (onSuccess) onSuccess();

      onClose();
    } catch (err) {
      console.error(err);
      setError("Falha ao criar a conta bancária. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nova Conta Bancária
          </h2>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Nome da Conta</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nubank, Itaú"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Saldo Inicial</Label>
            <InputMoney
              id="balance"
              name="balance"
              required
              placeholder="0,00"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Moeda</Label>
              <Input id="currency" name="currency"type="text" required placeholder="BRL, USD" value={currency} onChange={(e) => setCurrency(e.target.value)}/>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de Conta</Label>
              <select
                id="account_type"
                name="account_type"
                required
                className="w-full bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl dark:text-white outline-none text-sm focus:ring-2 focus:ring-candy-corn-400 cursor-pointer"
                value={account_type}
                onChange={(e) => setAccount_type(e.target.value as AccountType)}
              >
                <option value="CHECKING">Corrente</option>
                <option value="SAVINGS">Poupança</option>
                <option value="CREDIT">Crédito</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variants="standard" colors="secondary" className="flex-1" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variants="standard" colors="primary" className="flex-1" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateAccountModal;