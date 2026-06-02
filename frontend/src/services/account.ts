import type { AccountView } from "../types/account";
import { api } from "./api";

const ROUTE = 'bank_account'

const get_bank_accounts = async (): Promise<AccountView[]> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/`, {headers:{Authorization: `Bearer ${token}`}}).then((response) => response.data)
}

export {get_bank_accounts}