import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import { type UserView } from "../context/user-provider";

interface UserProps {
    user: UserView | null,
    setUser: Dispatch<SetStateAction<UserView | null>>
}

export const UserContext = createContext<UserProps | null>(null)

export const useUserContext = () => {
    const user = useContext(UserContext)

    return user
}