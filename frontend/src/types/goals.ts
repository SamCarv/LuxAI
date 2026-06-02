type Goal = {
    id: string,
    name: string,
    targetAmount: number,
    currentAmount: number,
    deadline: string,
}

type CreateGoal = {
    name: string,
    targetAmount: number,
    initialAmount: number,
    deadline: string,
}

type UpdateGoal = {
    amount: number,
    accountId: string
}

export type { Goal, CreateGoal, UpdateGoal }