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
      data => this.onDiscussionsUpdate(data)
    );
    this.notificationsSub = (await this.sse.getNotifications()).subscribe(
      data => this.onNotificationsUpdate(data)
    );
  }

  onDiscussionsUpdate(data: Discussion[] | Change<Discussion>) {
    if (isChange(data)) {
      const change = data as Change<Discussion>;
      switch (change.type) {
        case "insert": {
          const ref = change.docAfter!.readByIds.includes(this.userId!)
            ? this.olderDiscussions
            : this.activeDiscussions;
          ref.unshift(change.docAfter!);
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
          const targetRef = change.docAfter!.readByIds.includes(this.userId!)
            ? this.olderDiscussions
            : this.activeDiscussions;
          targetRef.unshift(change.docAfter!);
          break;
        }
      }
    } else {
      const discussions = data as Discussion[];
      this.olderDiscussions = discussions.filter(d => d.readByIds.includes(this.userId!));
      this.activeDiscussions = discussions.filter(d => ! d.readByIds.includes(this.userId!));
    }
  }

  onNotificationsUpdate(data: Notification[] | Change<Notification>) {
    if (isChange(data)) {
      const change = data as Change<Notification>;
      switch (change.type) {
        case "insert": {
          const ref = change.docAfter!.readByIds.includes(this.userId!)
            ? this.oldNotifications
            : this.newNotifications;
          ref.unshift(change.docAfter!);
          break;
        }
        case "delete": {
          const [ref, index] = this.findNotification(change.docId);
          ref.splice(index, 1);
          break;
        }
        case "update": {
          const [sourceRef, index] = this.findNotification(change.docId);
          sourceRef.splice(index, 1);
          const targetRef = change.docAfter!.readByIds.includes(this.userId!)
            ? this.oldNotifications
            : this.newNotifications;
          targetRef.unshift(change.docAfter!);
          break;
        }
      }
    } else {
      const notifications = data as Notification[];
      this.oldNotifications = notifications.filter(n => n.readByIds.includes(this.userId!));
      this.newNotifications = notifications.filter(n => ! n.readByIds.includes(this.userId!));
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
