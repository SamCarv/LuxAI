import { useState, type FC, type FormEvent } from "react";
import type { AccountView, CreateAccount } from "../../../types/account";
import { create_bank_account } from "../../../services/account";
import Modal from "../../../components/modal";
import Input from "../../../components/input";
import Button from "../../../components/button";
import Label from "../../../components/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface CreateAccountModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAccountModal: FC<CreateAccountModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateAccount>({
    name: "",
    balance: 0,
    currency: "BRL",
    account_type: "CHECKING",
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      createAccountMutation.mutate(formData);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Nome da Conta</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nubank, Itaú"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Saldo Inicial <span className="text-xs text-gray-500 dark:text-gray-300">(permitido tanto 5 quanto 5,00)</span></Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              required
              placeholder="0,00"
              value={formData.balance || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Moeda</Label>
              <Input
                id="currency"
                name="currency"
                type="text"
                required
                placeholder="BRL, USD..."
                value={formData.currency}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de Conta</Label>
              <select
                id="account_type"
                name="account_type"
                required
                className="w-full bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl dark:text-white outline-none text-sm focus:ring-2 focus:ring-candy-corn-400 cursor-pointer"
                value={formData.account_type}
                onChange={handleChange}
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