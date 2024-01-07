import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Change, Discussion, Notification, User, isChange } from 'sonddr-shared';
import { Subscription } from 'rxjs';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  // dependencies
  // --------------------------------------------
  sse = inject(SseService);
  auth = inject(AuthService);

  // attributes
  // --------------------------------------------
  userId?: string;
  discussionsSub?: Subscription;
  notificationsSub?: Subscription;
  oldNotifications: Notification[] = [];
  newNotifications: Notification[] = [];
  olderDiscussions: Discussion[] = [];
  activeDiscussions: Discussion[] = [];

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.auth.user$.subscribe(user => this.onUserUpdate(user));
  }

  // methods
  // --------------------------------------------
  async onUserUpdate(user: User | undefined) {
    this.discussionsSub?.unsubscribe();
    this.notificationsSub?.unsubscribe();
    if (!user) {
      this.reset();
      return;
    }
    this.userId = user.id;
    this.discussionsSub = (await this.sse.getDiscussions()).subscribe(
      payload => this.onDiscussionsUpdate(payload)
    );
    this.notificationsSub = (await this.sse.getNotifications()).subscribe(
      payload => this.onNotificationsUpdate(payload)
    );
  }

  onDiscussionsUpdate(payload: Discussion[] | Change<Discussion>) {
    if (isChange(payload)) {
      const change = payload as Change<Discussion>;
      switch (change.type) {
        case "insert": {
          const ref = change.payload!.readByIds.includes(this.userId!)
            ? this.olderDiscussions
            : this.activeDiscussions;
          ref.unshift(change.payload!);
          break;
        }
        case "delete": {
          const [ref, index] = this.findDiscussion(change.docId);
          ref.splice(index, 1);
          break;
        }
        case "update": {
          const [sourceRef, index] = this.findDiscussion(change.docId);
          sourceRef.splice(index, 1);
          const targetRef = change.payload!.readByIds.includes(this.userId!)
            ? this.olderDiscussions
            : this.activeDiscussions;
          targetRef.unshift(change.payload!);
          break;
        }
      }
    } else {
      const discussions = payload as Discussion[];
      this.olderDiscussions = discussions.filter(d => d.readByIds.includes(this.userId!));
      this.activeDiscussions = discussions.filter(d => ! d.readByIds.includes(this.userId!));
    }
  }

  onNotificationsUpdate(payload: Notification[] | Change<Notification>) {
    if (isChange(payload)) {
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
    if (index !== -1) { return [this.oldNotifications, index]; }
    index = this.newNotifications.findIndex(d => d.id === id);
    if (index !== -1) { return [this.newNotifications, index]; }
    throw new Error(`Failed to find notification ${id}`);
  }

  findDiscussion(id: string): [Discussion[], number] {
    let index: number;
    index = this.olderDiscussions.findIndex(d => d.id === id);
    if (index !== -1) { return [this.olderDiscussions, index]; }
    index = this.activeDiscussions.findIndex(d => d.id === id);
    if (index !== -1) { return [this.activeDiscussions, index]; }
    throw new Error(`Failed to find discussion ${id}`);
  }

  reset() {
    this.userId = undefined;
    this.newNotifications = [];
    this.newNotifications = [];
    this.olderDiscussions = [];
    this.activeDiscussions = [];
  }
}
