import { Component, inject } from '@angular/core';
import { Goal } from 'src/app/interfaces/goal';
import { Idea, IdeaOrderBy } from 'src/app/interfaces/idea';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  auth = inject(AuthenticationService);
  tab = inject(TabService);

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

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoals();
    this._loadIdeas();
  }

  // methods
  // --------------------------------------------
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
