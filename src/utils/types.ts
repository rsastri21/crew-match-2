export type UserSession = {
    id: string;
    role: "user" | "production_head";
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
