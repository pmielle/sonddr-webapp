import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Change, Discussion, Notification } from 'sonddr-shared';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);
  auth = inject(AuthService);

  // attributes
  // --------------------------------------------
  discussionsSub?: Subscription;
  notificationsSub?: Subscription;
  oldNotifications?: Notification[];
  newNotifications?: Notification[];
  olderDiscussions?: Discussion[];
  activeDiscussions?: Discussion[];
  
  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.auth.user$.subscribe((user) => {
      this.discussionsSub?.unsubscribe();
      this.notificationsSub?.unsubscribe();
      if (! user) { 
        this.reset();
        return;
      }
      this.discussionsSub = this.api.getDiscussions().subscribe((payload) => this.onDiscussionsUpdate(payload));
      this.notificationsSub = this.api.getNotifications().subscribe((payload) => this.onNotificationsUpdate(payload));
    });
  }

  // methods
  // --------------------------------------------
  onDiscussionsUpdate(payload: Discussion[]|Change<Discussion>) {
    if (this.api.isChange(payload)) {
      console.log("discussions change!!");
    } else {
      this.olderDiscussions = payload as Discussion[];
    }
  }

  onNotificationsUpdate(payload: Notification[]|Change<Notification>) {
    if (this.api.isChange(payload)) {
      console.log("notifications change!!");
    } else {
      this.oldNotifications = payload as Notification[];
    }
  }

  reset() {
    this.newNotifications = undefined;
    this.newNotifications = undefined;
    this.olderDiscussions = undefined;
    this.activeDiscussions = undefined;
  }
}
