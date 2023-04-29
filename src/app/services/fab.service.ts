import { Injectable, inject } from '@angular/core';
import { FabMode } from '../interfaces/fab-mode';
import { TabService } from './tab.service';

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

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._initTabStacks();
  }

  // methods
  // --------------------------------------------
  _initTabStacks() {
    this.tab.tabs.forEach((t) => this.tabStacks[t.name] = []);
  }
}
