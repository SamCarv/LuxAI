import type { CreateTransaction, TransactionView, UpdateTransaction } from "../types/transaction"
import { api } from "./api"

const ROUTE = 'transaction'

const list_transactions = async (): Promise<TransactionView[]> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/`, {headers: {Authorization: `Bearer ${token}`}}).then((response) => response.data);
}

const create_transaction = async (createTransaction: CreateTransaction) => {
    const token = localStorage.getItem("token");
    return api.post(`/${ROUTE}/`, createTransaction, {headers: {Authorization: `Bearer ${token}`}}).then((response) => response.data);
}

const update_transaction = async (id: string, updateTransaction: UpdateTransaction) => {
    const token = localStorage.getItem("token");
    return api.patch(`/${ROUTE}/${id}`, updateTransaction, {headers: {Authorization: `Bearer ${token}`}}).then((response) => response.data);
}

const delete_transaction = async (id: string) => {
    const token = localStorage.getItem("token");
    return api.delete(`/${ROUTE}/${id}`, {headers: {Authorization: `Bearer ${token}`}});
}

export { list_transactions, create_transaction, update_transaction, delete_transaction }