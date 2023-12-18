import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Change, Discussion, Notification } from 'sonddr-shared';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthService);


  // attributes
  // --------------------------------------------
  private url = "http://localhost:3000";


  // lifecycle hooks
  // --------------------------------------------
  constructor() { }


  // public methods
  // --------------------------------------------
  async getDiscussions(): Promise<Observable<Change<Discussion> | Discussion[]>> {
    return this._getAndWatch<Discussion>("discussions");
  }

  async getNotifications(): Promise<Observable<Change<Notification> | Notification[]>> {
    return this._getAndWatch<Notification>("notifications");
  }


  // private methods
  // --------------------------------------------
  private async _getAndWatch<T>(path: string): Promise<Observable<T[] | Change<T>>> {
    const token = await this.auth.getToken();
    const source = new EventSource(`${this.url}/${path}?token=${token}`);
    return new Observable(subscriber => {
      source.onmessage = (message: MessageEvent<string>) => {
        const payload = JSON.parse(message.data, (key, value) => {
          if (/[Dd]ate$/.test(key)) {
            value = new Date(value);
          }
          return value;
        });
        // each message can be either a T[] (initial value)
        //     or a Change<T> if db has been updated
        subscriber.next(payload as T[] | Change<T>);
      };
      source.onerror = (err) => subscriber.error(err);
      return () => {
        source.close();
      }
    });
  }

}
