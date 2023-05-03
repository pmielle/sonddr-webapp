import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Goal } from 'src/app/interfaces/goal';
import { Idea, IdeaOrderBy } from 'src/app/interfaces/idea';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ColorService } from 'src/app/services/color.service';
import { DatabaseService } from 'src/app/services/database.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-goal-view',
  templateUrl: './goal-view.component.html',
  styleUrls: ['./goal-view.component.scss']
})
export class GoalViewComponent {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  auth = inject(AuthenticationService);
  tab = inject(TabService);
  color = inject(ColorService);
  route = inject(ActivatedRoute);

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

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoal().then(() => {
      this._loadIdeas();
    }).catch((err) => {
      console.error(`_loadGoal failed, cannot continue the initial loading of the page: ${err}`);
      return;
    });
  }

  // methods
  // --------------------------------------------
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
