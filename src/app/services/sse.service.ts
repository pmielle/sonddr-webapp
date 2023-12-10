import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Change, Discussion, Notification } from 'sonddr-shared';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  // attributes
  // --------------------------------------------
  private url = "http://0.0.0.0:3000";


  // lifecycle hooks
  // --------------------------------------------
  constructor() { }


  // public methods
  // --------------------------------------------
  getDiscussions(): Observable<Discussion[]|Change<Discussion>> {
    return this._getAndWatch<Discussion>("discussions");
  }

  getNotifications(): Observable<Notification[]|Change<Notification>> {
    return this._getAndWatch<Notification>("notifications");
  }


  // private methods
  // --------------------------------------------
  private _getAndWatch<T>(path: string): Observable<T[]|Change<T>> {
    const source = new EventSource(`${this.url}/${path}`);
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
        subscriber.next(payload as T[]|Change<T>);
      };
      source.onerror = (err) => subscriber.error(err);
      return () => {
        source.close();
      }
    });
  }

}
