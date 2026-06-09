import type { AccountView, CreateAccount } from "../types/account";
import { api } from "./api";

const ROUTE = 'bank_account'

const get_bank_accounts = async (): Promise<AccountView[]> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/`, {headers:{Authorization: `Bearer ${token}`}}).then((response) => response.data)
}

const create_bank_account = async (createAccount: CreateAccount): Promise<AccountView> => {
    const token = localStorage.getItem("token");
    return api.post(`/${ROUTE}/`, createAccount, {headers:{Authorization: `Bearer ${token}`}}).then((response) => response.data)
}

export { get_bank_accounts, create_bank_account}