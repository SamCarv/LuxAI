import type { UserCreate } from "../types/userDTO/userCreate"
import { api } from "./api"

const create_user = async (userCreate: UserCreate) => {
    return api.post(`/`, userCreate)
}

export { create_user }