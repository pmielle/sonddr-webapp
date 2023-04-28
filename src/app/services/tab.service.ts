import { Injectable, OnDestroy, inject } from '@angular/core';
import { Tab } from '../interfaces/tab';
import { IdeasViewComponent } from '../views/ideas-view/ideas-view.component';
import { MessagesViewComponent } from '../views/messages-view/messages-view.component';
import { NotificationsViewComponent } from '../views/notifications-view/notifications-view.component';
import { SearchViewComponent } from '../views/search-view/search-view.component';
import { Subscription, filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TabService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  router = inject(Router);

  // attributes
  // --------------------------------------------
  tabs: Tab[] = [
    {name: "ideas", icon: "lightbulb", component: IdeasViewComponent},
    {name: "search", icon: "search", component: SearchViewComponent},
    {name: "messages", icon: "forum", component: MessagesViewComponent},
    {name: "notifications", icon: "notifications", component: NotificationsViewComponent},
  ];
  defaultTab = this.tabs[0];
  selectedTab = this.defaultTab;
  routerSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.routerSub = this._onRouteChange();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _onRouteChange(): Subscription {
    return this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((_) => {
      this.selectedTab = this.defaultTab;
    });
  }
}
