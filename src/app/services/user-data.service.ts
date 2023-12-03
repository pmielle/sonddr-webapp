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
  oldNotifications: Notification[] = [];
  newNotifications: Notification[] = [];
  olderDiscussions: Discussion[] = [];
  activeDiscussions: Discussion[] = [];

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
      const change = payload as Change<Discussion>;
      switch (change.type) {
        case "insert": {
          this.activeDiscussions.unshift(change.payload!);
          break;
        }
        case "delete": {
          const [ref, index] = this.findDiscussion(change.docId);
          ref.splice(index, 1);
          break;
        }
        case "update": {
          const [ref, index] = this.findDiscussion(change.docId);
          ref.splice(index, 1);
          this.activeDiscussions.unshift(change.payload!);
          break;
        }
      }
    } else {
      this.olderDiscussions = payload as Discussion[];
    }
  }

  onNotificationsUpdate(payload: Notification[]|Change<Notification>) {
    if (this.api.isChange(payload)) {
      const change = payload as Change<Notification>;
      switch (change.type) {
        case "insert": {
          this.newNotifications.unshift(change.payload!);
          break;
        }
        case "delete": {
          const [ref, index] = this.findNotification(change.docId);
          ref.splice(index, 1);
          break;
        }
        case "update": {
          const [ref, index] = this.findNotification(change.docId);
          ref.splice(index, 1);
          this.newNotifications.unshift(change.payload!);
          break;
        }
      }
    } else {
      this.oldNotifications = payload as Notification[];
    }
  }

  findNotification(id: string): [Notification[], number] {
    let index: number;
    index = this.oldNotifications.findIndex(d => d.id === id);
    if (index !== -1) { return [ this.oldNotifications, index ]; }
    index = this.newNotifications.findIndex(d => d.id === id);
    if (index !== -1) { return [ this.newNotifications, index ]; }
    throw new Error(`Failed to find notification ${id}`);
  }

  findDiscussion(id: string): [Discussion[], number] {
    let index: number;
    index = this.olderDiscussions.findIndex(d => d.id === id);
    if (index !== -1) { return [ this.olderDiscussions, index ]; }
    index = this.activeDiscussions.findIndex(d => d.id === id);
    if (index !== -1) { return [ this.activeDiscussions, index ]; }
    throw new Error(`Failed to find discussion ${id}`);
  }

  reset() {
    this.newNotifications = [];
    this.newNotifications = [];
    this.olderDiscussions = [];
    this.activeDiscussions = [];
  }
}
