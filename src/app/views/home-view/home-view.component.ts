import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Goal } from 'src/app/interfaces/goal';
import { Idea, IdeaOrderBy } from 'src/app/interfaces/idea';
import { ideaTab } from 'src/app/interfaces/tab';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnDestroy {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  auth = inject(AuthenticationService);
  tab = inject(TabService);
  fab = inject(FabService);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  goals: Goal[] = [];
  ideas: Idea[] = [];
  _ideaOrderBy = IdeaOrderBy.Date;
  get ideaOrderBy() { return this._ideaOrderBy; }
  set ideaOrderBy(value) { 
    this._ideaOrderBy = value; 
    this._onideaOrderByChange();
  }
  fabClickSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoals();
    this._loadIdeas();
    this.fabClickSub = this._subscribeToFabClick();
  }

  ngOnDestroy() {
    this.fabClickSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _onFabClick() {
    this.router.navigate(["add"]);
  }

  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
  }

  async _onideaOrderByChange() {
    this._refreshIdeas();
  }

  async _refreshIdeas() {
    this.ideas = await this.db.getIdeas(this.ideaOrderBy);
  }

  async _loadGoals() {
    this.goals = await this.db.getGoals();
  }

  async _loadIdeas() {
    this.ideas = await this.db.getIdeas(this.ideaOrderBy);
  }
}
