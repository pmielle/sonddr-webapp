import { Injectable, inject } from '@angular/core';
import { FabMode } from '../interfaces/fab-mode';
import { TabService } from './tab.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FabService {

  // dependencies
  // --------------------------------------------
  tab = inject(TabService);

  // attributes
  // --------------------------------------------
  tabStacks: { [tab: string]: FabMode[] } = {}
  mode: FabMode|undefined = undefined;
  tabSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._initTabStacks();
    this.tabSub = this._onTabChange();
  }

  // methods
  // --------------------------------------------
  _onTabChange(): Subscription {
    return this.tab.selectedTab.subscribe((t) => {
      let stack = this.tabStacks[t.name];
      if (stack.length <= 0) {
        this.mode = undefined;
      }
      this.mode = stack[stack.length - 1];      
    });
  }

  _initTabStacks() {
    this.tab.tabs.forEach((t) => {
      this.tabStacks[t.name] = [];
      if (t.fab) {
        this.tabStacks[t.name].push(t.fab);
      }
    });
  }
}
