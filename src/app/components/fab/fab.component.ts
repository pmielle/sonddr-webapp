import { Component, OnDestroy, inject } from '@angular/core';
import { fadeSlideInOut } from 'src/app/animations/in-out';
import { FabMode } from 'src/app/interfaces/fab-mode';
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

  // attributes
  // --------------------------------------------
  // ...

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  ngOnDestroy() { }

  // methods
  // --------------------------------------------
  onClick() {    
    this.fab.click$.next(this.tab.selectedTab);
  }
  chooseMode(): FabMode|undefined {
    let stack = this.fab.tabStacks[this.tab.selectedTab.name];
    return stack[stack.length - 1];
  }
}
