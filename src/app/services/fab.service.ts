import { Injectable, OnDestroy, inject } from '@angular/core';
import { FabMode, addMode, goalMode, homeMode, upvoteMode, profileMode, userMode } from '../interfaces/fab-mode';
import { TabService } from './tab.service';
import { Subject, Subscription, filter, map } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Tab } from '../interfaces/tab';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FabService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  tab = inject(TabService);
  auth = inject(AuthenticationService);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  tabStacks: { [tab: string]: (FabMode | undefined)[] } = {};
  click$ = new Subject<Tab>();
  defaultTab = this.tab.defaultTab;
  routerSub: Subscription;
  static userRouteRegex = /\/user\/(.+)/;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._initTabStacks();
    this.routerSub = this._onRouteChange();
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  pushToModeStack(mode: FabMode | undefined, tab?: Tab) {
    tab = tab || this.defaultTab;
    this.tabStacks[tab.name].push(mode);
  }

  popModeStack(tab?: Tab) {
    tab = tab || this.defaultTab;
    let stack = this.tabStacks[tab.name];
    if (stack.length <= 1) {
      console.error(`Cannot .pop ${tab.name}: its modeStack is already a single element`);
      return;
    }
    stack.pop();
  }

  setModeStack(mode: FabMode | undefined, tab?: Tab) {  // hypothesis: tabStacks are always init with only 1 element
    tab = tab || this.defaultTab;
    this.tabStacks[tab.name] = [mode];
  }

  _onRouteChange(): Subscription {
    return this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e as NavigationEnd),  // otherwise, rxjs does not understand
    ).subscribe(async (e) => {
      let newMode = await this._chooseFabOfRoute(e.urlAfterRedirects);
      this.setModeStack(newMode);
    });
  }

  async _chooseFabOfRoute(route: string): Promise<FabMode|undefined> {
    if (route.match(/\/idea\/.*/)) {
      return upvoteMode;
    } else if (route.match(/\/goal\/.+/)) {
      return goalMode;
    } else if (route.match(FabService.userRouteRegex)) {
      return await this._chooseUserViewMode(route);      
    } else if (route.match(/\/add(\?.+)?/)) {
      return addMode;
    } else if (route === "/") {
      return homeMode;
    } else {
      console.error(`Unexpected route ${route}: cannot set the correct fab mode`);
      return undefined;
    }
  }

  async _chooseUserViewMode(route: string): Promise<FabMode|undefined> {
    let matches = route.match(FabService.userRouteRegex);
    if (!matches || matches.length != 2) {
      console.error(`Failed to parse user route: ${route}`);
      return undefined;
    }
    let userId = matches[1];
    let authUser = await this.auth.getUser();
    if (!authUser) {
      console.error("auth.user is undefined");
      return undefined;
    }
    if (userId == authUser.id) {
      return profileMode;
    } else {
      return userMode;
    }
  }

  _initTabStacks() {
    this.tab.tabs.forEach((t) => {
      this.setModeStack(t.fab, t);
    });
  }
}
