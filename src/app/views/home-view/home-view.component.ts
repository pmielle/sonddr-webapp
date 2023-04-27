import { Component, OnDestroy, inject } from '@angular/core';
import { Tab } from 'src/app/interfaces/tab';
import { IdeasViewComponent } from '../ideas-view/ideas-view.component';
import { SearchViewComponent } from '../search-view/search-view.component';
import { MessagesViewComponent } from '../messages-view/messages-view.component';
import { NotificationsViewComponent } from '../notifications-view/notifications-view.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { INotification } from 'src/app/interfaces/i-notification';
import { Discussion } from 'src/app/interfaces/discussion';

@Component({
  selector: 'app-ideas-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnDestroy {
  
  // dependencies
  // --------------------------------------------
  auth = inject(AuthenticationService);
  db = inject(DatabaseService);

  // attributes
  // --------------------------------------------
  tabs: Tab[] = [
    {name: "ideas", icon: "lightbulb", component: IdeasViewComponent},
    {name: "search", icon: "search", component: SearchViewComponent},
    {name: "messages", icon: "forum", component: MessagesViewComponent},
    {name: "notifications", icon: "notifications", component: NotificationsViewComponent},
  ];
  selectedTab: Tab = this.tabs[0];
  notifications$ = this._getNotifications();
  notificationsSub: Subscription;
  discussions$ = this._getDiscussions();
  discussionsSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.notificationsSub = this.notifications$.subscribe(
      (notifications) => this._updateBadge("notifications", notifications.length)
    );
    this.discussionsSub = this.discussions$.subscribe(
      (discussions) => this._updateBadge("messages", discussions.length)
    );
  }

  ngOnDestroy() {
    this.notificationsSub.unsubscribe();
    this.discussionsSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _updateBadge(name: string, n: number) {
    let tab = this.tabs.find((t) => t.name == name);
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
