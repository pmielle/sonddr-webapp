import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Goal } from 'sonddr-shared';

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

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // public methods
  // --------------------------------------------
  async getGoals(): Promise<Goal[]> {
    return this._get<Goal[]>("goals");
  }

  // private methods
  // --------------------------------------------
  private async _get<T>(path: string): Promise<T> {
    return lastValueFrom(this.db.get<T>(`${this.apiUrl}/${path}`));
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
}
