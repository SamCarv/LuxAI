import type { UserCreate, UserUpdate } from "../types/user";
import { api } from "./api";

const ROUTE = "user";

const get_user_by_id = async (id: string) => {
  const token = localStorage.getItem("token");
  return api.get(`/${ROUTE}/${id}`, {headers: {Authorization: `Bearer ${token}`}});
};

const create_user = async (userCreate: UserCreate) => {
  return api.post(`${ROUTE}/`, userCreate);
};

const update_user = async (id: string, userUpdate: UserUpdate) => {
  const token = localStorage.getItem("token");
  return api.patch(`${ROUTE}/${id}`, userUpdate, {headers: {Authorization: `Bearer ${token}`}});
};

export { get_user_by_id, create_user, update_user };
