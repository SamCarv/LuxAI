export type AccountType = "CHECKING" | "SAVINGS" | "CREDIT"

type Account = {
    id: string,
    name: string,
    balance: number,
    currency: string,
    account_type: AccountType,
    user_id: string,
}

type AccountView = {
    id: string,
    name: string,
    balance: number,
    currency: string,
    account_type: AccountType,
    user_id: string,
}

type CreateAccount = {
    name: string,
    balance: number,
    currency: string,
    account_type: AccountType,
}

type UpdateAccount = {
    name?: string,
    balance?: number,
    currency?: string,
    account_type: AccountType,
}

export type { Account, AccountView, CreateAccount, UpdateAccount }