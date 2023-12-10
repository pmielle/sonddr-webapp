import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Cheer, Discussion, Goal, Idea, Message, PostResponse, User, makeCheerId, makeVoteId, Comment } from 'sonddr-shared';
import { SortBy } from '../components/idea-list/idea-list.component';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // dependencies
  // --------------------------------------------
  private db = inject(HttpClient);


  // attributes
  // --------------------------------------------
  private url = "http://0.0.0.0:3000";
  private goals?: Goal[];

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // public methods
  // --------------------------------------------
  async deleteVote(commentId: string, userId: string) {
    const id = makeVoteId(commentId, userId);
    return this._delete(`votes/${id}`);
  }

  async upvoteComment(commentId: string, userId: string) {
    const id = makeVoteId(commentId, userId);
    return this._put(`votes/${id}`, {commentId: commentId, value: 1});
  }

  async downvoteComment(commentId: string, userId: string) {
    const id = makeVoteId(commentId, userId);
    return this._put(`votes/${id}`, {commentId: commentId, value: -1});
  }

  async deleteCheer(ideaId: string, userId: string) {
    const id = makeCheerId(ideaId, userId);
    return this._delete(`cheers/${id}`);
  }

  async getCheer(ideaId: string, userId: string): Promise<Cheer> {
    const id = makeCheerId(ideaId, userId);
    return this._get<Cheer>(`cheers/${id}`);
  }

  async cheer(ideaId: string, userId: string): Promise<void> {
    const id = makeCheerId(ideaId, userId);
    return this._put(`cheers/${id}`, {ideaId: ideaId});
  }

  async getComment(id: string): Promise<Comment> {
    return this._get<Comment>(`comments/${id}`);
  }

  async postComment(ideaId: string, content: string): Promise<string> {
    return this._post("comments", {ideaId: ideaId, content: content});
  }

  async getMessage(id: string): Promise<Message> {
    return this._get<Message>(`messages/${id}`);
  }

  async postMessage(discussionId: string, content: string): Promise<string> {
    return this._post("messages", {discussionId: discussionId, content: content});
  }

  async searchIdeas(titleRegex: string): Promise<Idea[]> {
    return this._get<Idea[]>(`ideas?regex=${titleRegex}`);
  }

  async createNewDiscussion(toUserId: string, firstMessageContent: string): Promise<string> {
    return this._post("discussions", {toUserId: toUserId, firstMessageContent: firstMessageContent});
  }

  async searchUsers(nameRegex: string): Promise<User[]> {
    return this._get<User[]>(`users?regex=${nameRegex}`);
  }

  async postIdea(title: string, content: string, goalIds: string[]): Promise<string> {
    return this._post(`ideas`, {title: title, content: content, goalIds: goalIds});
  }

  async createUser(id: string, name: string): Promise<void> {
    return this._put(`users/${id}`, {name: name});
  }

  async getUser(id: string): Promise<User> {
    return this._get<User>(`users/${id}`);
  }

  async getIdea(id: string): Promise<Idea> {
    return this._get<Idea>(`ideas/${id}`);
  }

  async getGoal(id: string): Promise<Goal> {
    return this._get<Goal>(`goals/${id}`);
  }

  async getGoals(): Promise<Goal[]> {
    // return from cache
    if (this.goals) {
      return structuredClone(this.goals);
    }
    // get from db + add to cache + return
    const goals = await this._get<Goal[]>("goals");
    this.goals = goals;
    return goals;
  }

  async getIdeas(sortBy: SortBy, goalId?: string, authorId?: string): Promise<Idea[]> {
    let uri = "ideas";
    switch (sortBy) {
      case "recent": uri += "?order=date"; break;
      case "popular": uri += "?order=supports"; break;
      default: throw new Error(`unexpected sortBy: ${sortBy}`);
    }
    if (goalId) { uri += `&goalId=${goalId}`; }
    if (authorId) { uri += `&authorId=${authorId}`; }
    return this._get<Idea[]>(uri);
  }

  async getComments(sortBy: SortBy, ideaId?: string, authorId?: string): Promise<Comment[]> {
    let uri = "comments";
    switch (sortBy) {
      case "recent": uri += "?order=date"; break;
      case "popular": uri += "?order=rating"; break;
      default: throw new Error(`unexpected sortBy: ${sortBy}`);
    }
    if (ideaId) { uri += `&ideaId=${ideaId}`; }
    if (authorId) { uri += `&authorId=${authorId}`; }
    return this._get<Comment[]>(uri);
  }

  async getDiscussion(id: string): Promise<Discussion> {
    return this._get<Discussion>(`discussions/${id}`);
  }

  // private methods
  // --------------------------------------------
  private async _get<T>(path: string): Promise<T> {
    let data = await lastValueFrom(this.db.get<T>(`${this.url}/${path}`));
    this._convertApiDataToData(data);
    return data;
  }

  private async _post(path: string, payload: object): Promise<string> {
    const response = await lastValueFrom(this.db.post<PostResponse>(`${this.url}/${path}`, payload));
    return response.insertedId;
  }

  private async _delete(path: string): Promise<void> {
    return lastValueFrom(this.db.delete<void>(`${this.url}/${path}`));
  }

  private async _put(path: string, payload: object): Promise<void> {
    await lastValueFrom(this.db.put(`${this.url}/${path}`, payload));
  }

  private async _patch(path: string, payload: object): Promise<void> {
    return lastValueFrom(this.db.patch<void>(`${this.url}/${path}`, payload));
  }

  private _convertApiDataToData(apiData: any): any {
    if (Array.isArray(apiData)) {
      apiData.forEach(apiDoc => this._convertApiDocToDoc(apiDoc));
    } else {
      this._convertApiDocToDoc(apiData);
    }
  }

  private _convertApiDocToDoc(apiDoc: any) {
    for (let [key, value] of Object.entries(apiDoc)) {
      if (key == "date" || key.endsWith("Date")) {
        apiDoc[key] = new Date(value as any);
      }
      if (value instanceof Object) {
        this._convertApiDocToDoc(value);
      }
    }
  }

}
