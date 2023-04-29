import { Component, OnDestroy, inject } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Observable, Subscription, filter, firstValueFrom, of, switchMap } from 'rxjs';
import { INotification } from 'src/app/interfaces/i-notification';
import { Discussion } from 'src/app/interfaces/discussion';
import { Router } from '@angular/router';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnDestroy {
  
  // dependencies
  // --------------------------------------------
  auth = inject(AuthenticationService);
  db = inject(DatabaseService);
  router = inject(Router);
  tab = inject(TabService);

  // attributes
  // --------------------------------------------
  notifications$ = this._getNotifications();
  notificationsSub: Subscription;
  discussions$ = this._getDiscussions();
  discussionsSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._redirectIfNotLoggedIn();
    this.notificationsSub = this._onNotificationsChange();
    this.discussionsSub = this._onDiscussionsChange();
    
  }

  ngOnDestroy() {
    this.notificationsSub.unsubscribe();
    this.discussionsSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  onLogoClick() {
    if (this.tab.selectedTab.getValue() !== this.tab.defaultTab) {
      this.tab.goToTab(this.tab.defaultTab);
    }
    this.router.navigate(["/"]);
  }

  _onNotificationsChange(): Subscription {
    return this.notifications$.subscribe(
      (notifications) => this._updateBadge("notifications", notifications.length)
    );
  }

  _onDiscussionsChange(): Subscription {
    return this.discussions$.subscribe(
      (discussions) => this._updateBadge("messages", discussions.length)
    );
  }

  _redirectIfNotLoggedIn() {
    firstValueFrom(this.auth.user$).then((user) => {
      if (!user) {
        this.router.navigate(["login"])
      }
    })
  }

  _updateBadge(name: string, n: number) {
    let tab = this.tab.tabs.find((t) => t.name == name);
    if (tab == undefined) {
      console.error(`${name} tab not found: cannot update its badge`);
      return;
    }
    tab.badge = n > 0 ? this._toBadge(n) : undefined;
  }

  _toBadge(n: number): string {
    if (n > 99) { return "99+" }
    return `${n}`;
  }

  _getNotifications(): Observable<INotification[]> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.getNotifications(user.id);
        } else {
          return of([]);
        }
      })
    );
  }

  _getDiscussions(): Observable<Discussion[]> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.getDiscussions(user.id);
        } else {
          return of([]);
        }
      })
    );
  }
}
