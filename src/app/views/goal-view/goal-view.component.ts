import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Goal } from 'src/app/interfaces/goal';
import { Idea, IdeaOrderBy } from 'src/app/interfaces/idea';
import { ideaTab } from 'src/app/interfaces/tab';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ColorService } from 'src/app/services/color.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';
import { IRouterService } from 'src/app/services/i-router.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-goal-view',
  templateUrl: './goal-view.component.html',
  styleUrls: ['./goal-view.component.scss']
})
export class GoalViewComponent implements OnDestroy {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  auth = inject(AuthenticationService);
  tab = inject(TabService);
  color = inject(ColorService);
  route = inject(ActivatedRoute);
  fab = inject(FabService);
  router = inject(Router);
  irouter = inject(IRouterService);

  // attributes
  // --------------------------------------------
  goal?: Goal;
  ideas: Idea[] = [];
  _ideaOrderBy = IdeaOrderBy.Date;
  get ideaOrderBy() { return this._ideaOrderBy; }
  set ideaOrderBy(value) {    
    this._ideaOrderBy = value;
    this._onideaOrderByChange();
  }
  fabClickSub: Subscription;
  sameUrlNavigationSub = this.irouter.onSameUrlNavigation$.subscribe(() => this._reload());


  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._initialLoad();
    this.fabClickSub = this._subscribeToFabClick();
  }

  ngOnDestroy(): void {
    this.fabClickSub.unsubscribe();
    this.sameUrlNavigationSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _initialLoad() {
    this._loadGoal().then(() => {
      this._loadIdeas();
    }).catch((err) => {
      console.error(`_loadGoal failed, cannot continue the initial loading of the page: ${err}`);
      return;
    });
  }

  _reload() {
    this.ideas = [];
    this.goal = undefined;
    this._ideaOrderBy = IdeaOrderBy.Date;
    this._initialLoad();
  }

  _onFabClick() {
    let queryParams: Params = {};
    if (this.goal) {
      queryParams["preselectedGoal"] = this.goal.id;
    } else {
      console.error("goal is undefined, cannot preselect it");
    }
    this.router.navigate(["add"], {queryParams: queryParams});
  }

  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
  }

  async _loadGoal(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let goalId = this.route.snapshot.paramMap.get("id");
      if (!goalId) {
        reject("Failed to get \"id\" from paramMap: cannot get the id of the goal to display");
        return;
      }
      this.goal = await this.db.getGoal(goalId);
      if (!this.goal) {
        reject(`Failed to get goal with id ${goalId}`);
        return;
      }
      resolve();
    });
  }

  async _onideaOrderByChange() {
    this._refreshIdeas();
  }

  async _refreshIdeas() {
    if (this.goal === undefined) {
      console.error("goal is undefined, cannot get its ideas");
      return;
    }
    this.ideas = await this.db.getIdeasOfGoal(this.goal.id, this.ideaOrderBy);
  }

  async _loadIdeas() {
    if (this.goal === undefined) {
      console.error("goal is undefined, cannot get its ideas");
      return;
    }
    this.ideas = await this.db.getIdeasOfGoal(this.goal.id, this.ideaOrderBy);
  }
}
