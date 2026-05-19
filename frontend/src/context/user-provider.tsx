import { useState, type ReactNode } from "react"
import { UserContext } from "../hooks/use-user-context"

export type UserView = {
    full_name: string,
    email: string,
    is_active: boolean,
    ai_provider: string
}

export const UserProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<UserView | null>(null);

    return (
        <UserContext value={{user, setUser}}>
            {children}
        </UserContext>
    )
}