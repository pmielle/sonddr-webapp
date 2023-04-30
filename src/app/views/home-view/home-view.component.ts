import { Component, inject } from '@angular/core';
import { Goal } from 'src/app/interfaces/goal';
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

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoals();
  }

  // methods
  // --------------------------------------------
  async _loadGoals() {
    this.goals = await this.db.getGoals();
  }
}
