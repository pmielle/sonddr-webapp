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
  discussionsSub?: Subscription;
  notificationsSub?: Subscription;

  constructor() {

    this.auth.user$.subscribe((user) => {

      this.discussionsSub?.unsubscribe();
      this.notificationsSub?.unsubscribe();

      if (! user) { 
        this.discussions$.next(undefined);
        this.notifications$.next(undefined);
        return;
      }
      
      this.discussionsSub = this.api.getDiscussions().subscribe(this.discussions$);
      this.notificationsSub = this.api.getNotifications().subscribe(this.notifications$);
      
    });

  }
}
