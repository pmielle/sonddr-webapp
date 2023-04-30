import { Component, inject } from '@angular/core';
import { Goal } from 'src/app/interfaces/goal';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);

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
