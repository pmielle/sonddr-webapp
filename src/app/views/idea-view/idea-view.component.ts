import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { ideaTab } from 'src/app/interfaces/tab';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';

@Component({
  selector: 'app-idea-view',
  templateUrl: './idea-view.component.html',
  styleUrls: ['./idea-view.component.scss']
})
export class IdeaViewComponent implements OnDestroy {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  fab = inject(FabService);
  route = inject(ActivatedRoute);

  // attributes
  // --------------------------------------------
  idea?: Idea;
  fabClickSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadIdea();
    this.fabClickSub = this._subscribeToFabClick();
  }

  ngOnDestroy(): void {
    this.fabClickSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _onFabClick() {
    console.log("click....");
  }
  
  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
  }

  _loadIdea(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let ideaId = this.route.snapshot.paramMap.get("id");
      if (!ideaId) {
        reject("Failed to get \"id\" from paramMap: cannot get the id of the idea to display");
        return;
      }
      this.idea = await this.db.getIdea(ideaId);
      if (!this.idea) {
        reject(`Failed to get idea ${ideaId}`);
        return;
      }
    });
  }
}
