import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { fadeSlideInOut } from 'src/app/animations/in-out';
import { FabMode } from 'src/app/interfaces/fab-mode';
import { Tab } from 'src/app/interfaces/tab';
import { FabService } from 'src/app/services/fab.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  animations: [fadeSlideInOut],
})
export class FabComponent implements OnDestroy {

  // dependencies
  // --------------------------------------------
  fab = inject(FabService);
  tab = inject(TabService);
  mode: FabMode|undefined = undefined;

  // attributes
  // --------------------------------------------
  fabAndTabSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.fabAndTabSub = combineLatest([this.fab.tabStacks, this.tab.selectedTab]).subscribe(
      ([tabStacks, selectedTab]) => {
        this.mode = this._chooseMode(tabStacks, selectedTab);
      })
  }

  ngOnDestroy() {
    this.fabAndTabSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _chooseMode(tabStacks: { [tab: string]: FabMode[] }, selectedTab: Tab): FabMode|undefined {
    let stack = tabStacks[selectedTab.name];
    if (stack.length <= 0) {
      return undefined;
    }
    return stack[stack.length - 1];
  }
}
