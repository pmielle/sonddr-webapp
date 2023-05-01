export interface Idea {
    id: string,
    title: string,
    date: string,
    upvotes: number,
}

export enum IdeaOrderBy {
    Date = "date",
    Upvotes = "upvotes",
};
