import type { CreateGoal, Goal, UpdateGoal } from "../types/goals"
import { api } from "./api"

const ROUTE = 'goal'

const list_goals = (): Promise<Goal[]> => {
    const token = localStorage.getItem("token");
    return api.get(`/${ROUTE}/`, {headers:{Authorization: `Bearer ${token}`}})
}

const create_goal = (newGoal: CreateGoal) => {
    const token = localStorage.getItem("token");
    return api.post(`/${ROUTE}/`, newGoal, {headers:{Authorization: `Bearer ${token}`}})
}

const update_goal_balance = (id: string, updateGoal: UpdateGoal) => {
    const token = localStorage.getItem("token");
    return api.patch(`/${ROUTE}/${id}`, updateGoal, {headers:{Authorization: `Bearer ${token}`}})
}

const delete_goals = (ids: string[]) => {
    const token = localStorage.getItem("token");
    return api.post(`/${ROUTE}/`, {data: {ids},headers:{Authorization: `Bearer ${token}`}})
}

export { list_goals, create_goal, update_goal_balance, delete_goals }