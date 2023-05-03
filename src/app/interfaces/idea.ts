export interface Idea {
    id: string,
    title: string,
    date: string,
    upvotes: number,
    goalIds: string[],
    content: string,
}

export enum IdeaOrderBy {
    Date = "date",
    Upvotes = "upvotes",
};
