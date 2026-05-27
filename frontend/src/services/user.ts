import type { UserCreate } from "../types/userDTO/userCreate";
import type { UserUpdate } from "../types/userDTO/userUpdate";
import { api } from "./api";

const ROUTE = "user";

const get_user_by_id = async (id: string) => {
  return api.get(`/${ROUTE}/${id}`);
};

const create_user = async (userCreate: UserCreate) => {
  return api.post(`${ROUTE}/`, userCreate);
};

const update_user = async (id: string, userUpdate: UserUpdate) => {
  const token = localStorage.getItem("token");
  return api.patch(`${ROUTE}/${id}`, userUpdate, {headers: {
      Authorization: `Bearer ${token}`
  }});
};

export { get_user_by_id, create_user, update_user };
