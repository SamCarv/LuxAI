type GoalView = {
    id: string,
    name: string,
    target_amount: number,
    current_amount: number,
    deadline: string,
    user_id: string
}

type CreateGoal = {
    name: string,
    target_amount: number,
    initial_amount: number,
    deadline: string,
}

type UpdateGoal = {
    name: string,
    target_amount: number,
    current_amount: number,
    deadline: string,
}

export type { GoalView, CreateGoal, UpdateGoal }