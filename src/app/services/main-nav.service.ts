import { EventEmitter, Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription, filter } from 'rxjs';

export type Tab = "ideas" | "search" | "messages" | "notifications";
export type FabMode = {
  icon: string,
  color: string,
  label?: string,
  action: () => void,
};

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
  atTabRoot$ = new BehaviorSubject<boolean|undefined>(undefined);
  fabMode$ = new BehaviorSubject<FabMode|undefined>(undefined);
  routerSub?: Subscription;
  

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
    window.scrollTo({
      top: document.body.scrollHeight, 
      left: 0, 
      behavior: smooth ? "smooth" : "instant"
    });
  }

  scrollToTop(smooth: boolean = false) {
    window.scrollTo({
      top: 0, 
      left: 0, 
      behavior: smooth ? "smooth" : "instant"
    });
  }

  onRouteChange(e: NavigationEnd) {
    const url = e.urlAfterRedirects;
    this.updateTab(url);
    this.updateFab(url);
    this.updateAtTabRoot(url);
  }

  updateAtTabRoot(url: string) {
    this.atTabRoot$.next(
      ["/ideas", "/search", "/messages", "/notifications"].includes(url)
    );
    
  } 

  updateTab(url: string) {
    if (url.startsWith("/ideas")) {
      this.tab$.next("ideas");
    } else if (url.startsWith("/search")) {
      this.tab$.next("search");
    }else if (url.startsWith("/messages")) {
      this.tab$.next("messages");
    } else if (url.startsWith("/notifications")) {
      this.tab$.next("notifications");
    } else {
      console.error(`cannot select tab: ${url} is not an exepected url`);
      this.tab$.next(undefined);
    }
  }

  updateFab(url: string) {
    if (url === "/ideas") {
      this.fabMode$.next({
        icon: "add",
        color: "var(--primary-color)",
        label: "Share<br>an idea",
        action: () => {this.router.navigateByUrl("/ideas/add")}
      });
    } else if (url.startsWith("/ideas/goal/")) {
      const goalId = url.split(/\//)[3];
      this.fabMode$.next({
        icon: "add",
        color: "var(--primary-color)",
        label: "Share<br>an idea",
        action: () => {this.router.navigateByUrl(`/ideas/add?preselected=${goalId}`)}
      });
    } else if (url.startsWith("/ideas/user/")) {
      const userId = url.split(/\//)[3];
      this.fabMode$.next({
        icon: "add",
        color: "var(--blue)",
        label: "Send a<br>message",
        action: () => {this.router.navigateByUrl(`/messages/new-discussion?preselected=${userId}`)}
      });
    } else if (url.startsWith("/ideas/idea/")) {
      this.fabMode$.next({
        icon: "favorite_outline",
        color: "var(--primary-color)",
        label: "Support",
        action: () => {this.fabClick.next();}
      });
    } else if (url === "/messages") {
      this.fabMode$.next({
        icon: "add",
        color: "var(--blue)",
        label: "Start a<br>discussion",
        action: () => {this.router.navigateByUrl(`/messages/new-discussion`)}
      });
    } else if (url.startsWith("/ideas/add")) {
      this.fabMode$.next({
        icon: "done",
        color: "var(--green)",
        label: "Share",
        action: () => {this.fabClick.next();}
      });
    } else if (url.startsWith("/messages/new-discussion")) {
      this.fabMode$.next(undefined);
    } else if (url === "/ideas/profile") {
      this.fabMode$.next({
        icon: "logout",
        color: "var(--red)",
        label: "Log out",
        action: () => {console.log("click in profile")}
      });
    } else if (url.startsWith("/messages/discussion/")) {
      this.fabMode$.next(undefined);
    } else if (url === "/notifications") {
      this.fabMode$.next(undefined);
    } else if (url === "/search") {
      this.fabMode$.next(undefined);
    } else if (url === "/") {
      this.fabMode$.next(undefined);
    } else {
      console.error(`cannot set fab mobe: ${url} is not an exepected url`);
      this.fabMode$.next(undefined);
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
