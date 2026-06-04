import type { CategoryView, CreateCategory, UpdateCategory } from "../types/category";
import { api } from "./api";

const ROUTE = 'category';

const list_categories = (): Promise<CategoryView[]> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/`, {headers:{Authorization: `Bearer ${token}`}}).then((response) => response.data);
}

const get_one_category = (id: string): Promise<CategoryView> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/${id}`, {headers:{Authorization: `Bearer ${token}`}}).then((response) => response.data);
}

const create_category = (createCategory: CreateCategory) => {
    const token = localStorage.getItem("token");
    return api.post(`/${ROUTE}/`, createCategory, {headers:{Authorization: `Bearer ${token}`}});
}

const update_category = (id: string, updateCategory: UpdateCategory): Promise<CategoryView> => {
    const token = localStorage.getItem("token");
    return api.patch(`/${ROUTE}/${id}`, updateCategory, {headers:{Authorization: `Bearer ${token}`}}).then(response => response.data);
}

const delete_category = (id: string) => {
    const token = localStorage.getItem("token");
    return api.delete(`/${ROUTE}/${id}`, {headers:{Authorization: `Bearer ${token}`}});
}

export { list_categories, get_one_category, create_category, update_category, delete_category }