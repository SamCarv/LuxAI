type User = {
    id: number,
    hashed_password: string
}

type UserView = {
    full_name: string,
    email: string,
    is_active: boolean,
    ai_provider: string
}

type UserCreate = {
    full_name: string,
    email: string,
    password: string,
    is_active: boolean,
    ai_provider: string
}

type UserUpdate = {
    full_name: string | undefined,
    email: string | undefined,
    password: string | undefined,
    is_active: boolean | undefined,
    ai_provider: string | undefined,
    google_api_key: string | undefined
}

export type { User, UserCreate, UserUpdate, UserView };