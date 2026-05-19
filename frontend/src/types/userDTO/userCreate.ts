export type UserCreate = {
    full_name: string,
    email: string,
    password: string,
    is_active: boolean,
    ai_provider: string
}