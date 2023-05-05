import { IUser } from "./i-user";

export interface IComment {
    author: IUser,
    content: string,
    date: string,
    upvotes: number,
}

export interface DbComment {
    authorId: string,
    content: string,
    date: string,
    upvotes: number,
}

export enum CommentOrderBy {
    Date = "date",
    Upvotes = "upvotes",
};