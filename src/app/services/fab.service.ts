import { Injectable, OnDestroy, inject } from '@angular/core';
import { FabMode, goalMode, homeMode } from '../interfaces/fab-mode';
import { TabService } from './tab.service';
import { BehaviorSubject, Subscription, filter, map } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

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
  tabStacks = new BehaviorSubject<{ [tab: string]: FabMode[] }>({});
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
  _onRouteChange(): Subscription {
    return this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e as NavigationEnd),  // rxjs does not understand otherwise
    ).subscribe((e) => {
      let newMode: FabMode|undefined;
      switch(e.urlAfterRedirects) {
        case "/goal": 
          newMode = goalMode;
          break;
        case "/":
          newMode = homeMode;
          break;
        default:
          console.error(`Unexpected route ${e.urlAfterRedirects}: cannot set the correct fab mode`);
          newMode = undefined;
      }
      let value = this.tabStacks.getValue();
      value[this.tab.defaultTab.name] = newMode ? [newMode] : [];
      this.tabStacks.next(value);
    });
  }

  _initTabStacks() {
    let value = this.tabStacks.getValue();
    this.tab.tabs.forEach((t) => {
      value[t.name] = [];
      if (t.fab) {
        value[t.name].push(t.fab);
      }
    });
    this.tabStacks.next(value);
  }
}
