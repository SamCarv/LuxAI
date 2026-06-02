import type { TransactionView } from "../types/transaction"
import { api } from "./api"

const ROUTE = 'transaction'

const list_transactions = async (): Promise<TransactionView[]> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/`, {headers: {Authorization: `Beare ${token}`}}).then((response) => response.data);
}

export { list_transactions }