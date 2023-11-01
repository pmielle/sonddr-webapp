import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Discussion, Notification } from 'sonddr-shared';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  auth = inject(AuthService);
  api = inject(ApiService);

  discussions$ = new BehaviorSubject<Discussion[]|undefined>(undefined);
  notifications$ = new BehaviorSubject<Notification[]|undefined>(undefined);
  userSub?: Subscription;

  constructor() {
    this.auth.user$.subscribe((user) => {
      if (! user) { 
        this.discussions$.next(undefined);
        return;
      }
      this.api.getDiscussions().subscribe(this.discussions$);
      this.api.getNotifications().subscribe(this.notifications$);
    });
  }
}
