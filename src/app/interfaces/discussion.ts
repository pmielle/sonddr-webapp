import { IUser } from "./i-user";

export interface Discussion {
    id: string,
    users: IUser[];
}

export interface DbDiscussion {
    id: string,
    userIds: string[];
}
