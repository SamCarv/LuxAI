

export type Account = {
    id: string,
    name: string,
    balance: number,
    currency: string,
    account_type: "CHECKING" | "SAVING" | "CREDIT",
}