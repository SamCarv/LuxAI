import type { UserCreate } from "../types/userDTO/userCreate"
import { api } from "./api"

const ROUTE = "user"

const get_user_by_id = async (id: string) => {
    return api.get(`/${ROUTE}/${id}`)
}

const create_user = async (userCreate: UserCreate) => {
    return api.post(`${ROUTE}`, userCreate)
}

export { get_user_by_id, create_user }