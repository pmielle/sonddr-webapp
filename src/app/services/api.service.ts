import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

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
  // ...

  // private methods
  // --------------------------------------------
  private async _get(path: string): Promise<any> {
    return lastValueFrom(this.db.get(`${this.apiUrl}/${path}`));
  }

  private async _post(path: string, payload: object): Promise<any> {
    return lastValueFrom(this.db.post(`${this.apiUrl}/${path}`, payload));
  }

  private async _patch(path: string, payload: object): Promise<any> {
    return lastValueFrom(this.db.patch(`${this.apiUrl}/${path}`, payload));
  }

  private async _delete(path: string): Promise<any> {
    return lastValueFrom(this.db.delete(`${this.apiUrl}/${path}`));
  }

  private async _put(path: string, payload: object): Promise<any> {
    return lastValueFrom(this.db.put(`${this.apiUrl}/${path}`, payload));
  }
}
