import { Component, OnDestroy, inject } from '@angular/core';
import { Tab } from 'src/app/interfaces/tab';
import { IdeasViewComponent } from '../ideas-view/ideas-view.component';
import { SearchViewComponent } from '../search-view/search-view.component';
import { MessagesViewComponent } from '../messages-view/messages-view.component';
import { NotificationsViewComponent } from '../notifications-view/notifications-view.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Observable, Subscription, of, pipe, switchMap } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { INotification } from 'src/app/interfaces/i-notification';

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

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.notificationsSub = this.notifications$.subscribe(
      (notifications) => this._onNotificationsChange(notifications)
    );
  }

  ngOnDestroy() {
    this.notificationsSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _onNotificationsChange(notifications: INotification[]) {
    let tab = this.tabs.find((t) => t.name == "notifications");
    if (tab == undefined) {
      console.error("\"notifications\" tab not found: cannot update its badge");
      return;
    }
    let n = notifications.length
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
}
