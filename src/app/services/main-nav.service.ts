import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription, filter } from 'rxjs';

export type Tab = "ideas" | "search" | "messages" | "notifications";

@Injectable({
  providedIn: 'root'
})
export class MainNavService {

  // dependencies
  // --------------------------------------------
  router = inject(Router);

  // attributes
  // --------------------------------------------
  isNavBarHidden = false;
  isNavBarFlat = false;
  isFabHidden = false;
  isFabDisabled = false;
  fabClick = new EventEmitter<void>();
  tab$ = new BehaviorSubject<Tab|undefined>(undefined);
  routerSub?: Subscription;  // TODO: clarify where to unsubscribe

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.routerSub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(
      (e) => this.onRouteChange(e as NavigationEnd)
    );
  }

  // methods
  // --------------------------------------------
  goToTab(tab: Tab) {
    this.router.navigateByUrl(`/${tab}`);
  }

  scrollToBottom(smooth: boolean = false) {
    window.scrollTo({top: document.body.scrollHeight, left: 0, behavior: smooth ? "smooth" : "instant"});
  }

  scrollToTop(smooth: boolean = false) {
    window.scrollTo({top: 0, left: 0, behavior: smooth ? "smooth" : "instant"});
  }

  onRouteChange(e: NavigationEnd) {
    const url = e.urlAfterRedirects;

    // update current tab
    if (url.startsWith("/ideas")) {
      this.tab$.next("ideas");
    } else if (url.startsWith("/search")) {
      this.tab$.next("search");
    }else if (url.startsWith("/messages")) {
      this.tab$.next("messages");
    } else if (url.startsWith("/notifications")) {
      this.tab$.next("notifications");
    } else {
      this.tab$.next(undefined);
      throw new Error(`unexpected url: ${url}`);
    }
  }

  hideNavBar() {
    this.isNavBarHidden = true;
  }
  showNavBar() {
    this.isNavBarHidden = false;
  }

  flattenNavBar() {
    this.isNavBarFlat = true;
  }
  restoreNavBar() {
    this.isNavBarFlat = false;
  }

  hideFab() {
    this.isFabHidden = true;
  }
  showFab() {
    this.isFabHidden = false;
  }

  enableFab() {
    this.isFabDisabled = false;
  }
  disableFab() {
    this.isFabDisabled = true;
  }

  restoreFab() {
    this.isFabHidden = false;
    this.isFabDisabled = false;
  }
  
}
