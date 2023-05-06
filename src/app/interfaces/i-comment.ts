import { IUser } from "./i-user";

export interface IComment {
    id: string,
    author: IUser,
    content: string,
    date: string,
    upvotes: number,
}

export interface DbComment {
    id: string,
    authorId: string,
    content: string,
    date: string,
    upvotes: number,
}

export enum CommentOrderBy {
    Date = "date",
    Upvotes = "upvotes",
};

export let defaultCommentOrderBy = CommentOrderBy.Date;