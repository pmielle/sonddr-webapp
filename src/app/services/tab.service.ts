import { Injectable, OnDestroy, inject } from '@angular/core';
import { Tab, ideaTab, messagesTab, notificationsTab, searchTab } from '../interfaces/tab';
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
