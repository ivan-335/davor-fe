export const Status = {
    Active: 1,
    OnHold: 2,
    InProgress: 3,
    Completed: 4,
} as const;

export type Status = typeof Status[keyof typeof Status];
export interface Project {
    _id: string;
    userId: string;
    description: string;
    title: string;
    deadline: Date;
    status: Status;
    budget: string;
    createdAt: Date;
}