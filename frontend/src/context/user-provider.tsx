import { useState, type ReactNode } from "react"
import { UserContext } from "../hooks/use-user-context"
import type { UserView } from "../types/user";

export const UserProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<UserView | null>(null);

    return (
        <UserContext value={{user, setUser}}>
            {children}
        </UserContext>
    )
}