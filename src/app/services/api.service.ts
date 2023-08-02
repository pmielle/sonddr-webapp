import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private db = inject(HttpClient);

  constructor() { }

  async test() {
    this.get("http://localhost:3000/").then(console.log);
  }

  // private
  // --------------------------------------------
  private async get(url: string): Promise<any> {
    return lastValueFrom(this.db.get(url));
  }
}
