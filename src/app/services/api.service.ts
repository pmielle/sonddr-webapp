import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Discussion, Goal, Idea, User } from 'sonddr-shared';
import { SortBy } from '../components/idea-list/idea-list.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // dependencies
  // --------------------------------------------
  private db = inject(HttpClient);

  // attributes
  // --------------------------------------------
  private apiUrl = "http://localhost:3000";
  private goals?: Goal[];

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // public methods
  // --------------------------------------------
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
      return this.goals;
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

  async getDiscussions(): Promise<Discussion[]> {
    return this._get<Discussion[]>("discussions");
  }

  // private methods
  // --------------------------------------------
  private async _get<T>(path: string): Promise<T> {
    let data = await lastValueFrom(this.db.get<T>(`${this.apiUrl}/${path}`));
    this._convertApiDataToData(data);
    return data;
  }

  private async _post(path: string, payload: object): Promise<string> {
    return lastValueFrom(this.db.post<string>(`${this.apiUrl}/${path}`, payload));
  }

  private async _patch(path: string, payload: object): Promise<void> {
    return lastValueFrom(this.db.patch<void>(`${this.apiUrl}/${path}`, payload));
  }

  private async _delete(path: string): Promise<void> {
    return lastValueFrom(this.db.delete<void>(`${this.apiUrl}/${path}`));
  }

  private async _put(path: string, payload: object): Promise<string> {
    return lastValueFrom(this.db.put<string>(`${this.apiUrl}/${path}`, payload));
  }

  private _convertApiDataToData(apiData: any): any {
    if (Array.isArray(apiData)) {
      apiData.forEach(apiDoc => this._convertApiDocToDoc(apiDoc));
    } else {
      this._convertApiDocToDoc(apiData);
    }
  }
  
  private _convertApiDocToDoc(apiDoc: any): any {
    for (let [key, value] of Object.entries(apiDoc)) {
      if (key == "date" || key.endsWith("Date")) {
        apiDoc[key] = new Date(value as any);
      }
    }
  }

}
