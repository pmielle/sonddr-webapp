import { Injectable, OnDestroy, inject } from '@angular/core';
import { FabMode, goalMode, homeMode } from '../interfaces/fab-mode';
import { TabService } from './tab.service';
import { Subscription, filter, map } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Tab } from '../interfaces/tab';

@Injectable({
  providedIn: 'root'
})
export class FabService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  tab = inject(TabService);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  tabStacks: { [tab: string]: (FabMode|undefined)[] } = {};
  routerSub: Subscription;

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
  setModeStack(mode: FabMode|undefined, tab?: Tab) {  // hypothesis: tabStacks are always init with only 1 element
    if (tab === undefined) {
      tab = this.tab.defaultTab;
    }
    this.tabStacks[tab.name] = [mode];
  }

  _onRouteChange(): Subscription {
    return this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e as NavigationEnd),  // otherwise, rxjs does not understand
    ).subscribe((e) => {
      let newMode = this._chooseFabOfRoute(e.urlAfterRedirects);
      this.setModeStack(newMode);
    });
  }

  _chooseFabOfRoute(route: string): FabMode|undefined {
    switch(route) {
      case "/goal": 
        return goalMode;
      case "/":
        return homeMode;
        break;
      default:
        console.error(`Unexpected route ${route}: cannot set the correct fab mode`);
        return undefined;
    }
  }

  _initTabStacks() {
    this.tab.tabs.forEach((t) => {
      this.setModeStack(t.fab, t);
    });
  }
}
