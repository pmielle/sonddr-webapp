import { IUser } from "./i-user";

export interface Idea {
    id: string,
    title: string,
    date: string,
    upvotes: number,
    goalIds: string[],
    content: string,
    author: IUser,
}

export interface DbIdea {
    id: string,
    title: string,
    date: string,
    upvotes: number,
    goalIds: string[],
    content: string,
    authorId: string,
}

export enum IdeaOrderBy {
    Date = "date",
    Upvotes = "upvotes",
};
