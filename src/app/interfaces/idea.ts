export interface Idea {
    id: string,
    title: string,
    date: string,
    upvotes: number,
    goalIds: string[],
}

export enum IdeaOrderBy {
    Date = "date",
    Upvotes = "upvotes",
};
