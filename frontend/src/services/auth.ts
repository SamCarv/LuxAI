import type { UserLogin } from "../types/authDTO/userLogin"
import { api } from "./api"

const login_for_access_token = (userLogin: UserLogin) => {
    return api.post(`/login`, userLogin)
}

export { login_for_access_token }