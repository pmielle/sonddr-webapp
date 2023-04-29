import { Injectable, OnDestroy, inject } from '@angular/core';
import { Tab } from '../interfaces/tab';
import { IdeasViewComponent } from '../views/ideas-view/ideas-view.component';
import { MessagesViewComponent } from '../views/messages-view/messages-view.component';
import { NotificationsViewComponent } from '../views/notifications-view/notifications-view.component';
import { SearchViewComponent } from '../views/search-view/search-view.component';
import { Subscription, filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

let ideaTab: Tab = {
  name: "ideas", 
  icon: "lightbulb", 
  component: IdeasViewComponent, 
  fab: {icon: "add", color: "var(--primary-color)", label: "Share\nan idea"},
}

let searchTab: Tab = {
  name: "search", 
  icon: "search", 
  component: SearchViewComponent,
};
let messagesTab: Tab = {
  name: "messages", 
  icon: "forum", 
  component: MessagesViewComponent,
};
let notificationsTab: Tab = {
  name: "notifications", 
  icon: "notifications", 
  component: NotificationsViewComponent,
};

@Injectable({
  providedIn: 'root'
})
export class TabService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  router = inject(Router);

  // attributes
  // --------------------------------------------
  tabs: Tab[] = [ideaTab, searchTab, messagesTab, notificationsTab];
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
  goToTab(t: Tab) {
    this.selectedTab = t;
  } 

  _onRouteChange(): Subscription {
    return this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((_) => {
      this.goToTab(this.defaultTab);  
    });
  }
}
