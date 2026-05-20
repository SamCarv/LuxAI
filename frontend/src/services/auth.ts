import type { UserLogin } from "../types/authDTO/userLogin"
import { api } from "./api"

const login_for_access_token = (userLogin: UserLogin) => {
    const params = new URLSearchParams();
    params.append("username", userLogin.username);
    params.append("password", userLogin.password);

    return api.post(`/auth/login`, params)
}

export { login_for_access_token }