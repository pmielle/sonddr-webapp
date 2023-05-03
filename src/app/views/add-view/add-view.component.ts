import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Goal } from 'src/app/interfaces/goal';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-view',
  templateUrl: './add-view.component.html',
  styleUrls: ['./add-view.component.scss']
})
export class AddViewComponent {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  db = inject(DatabaseService);

  // attributes
  // --------------------------------------------
  queryParamSub?: Subscription;
  goals: Goal[] = [];
  selectedGoals: Goal[] = [];

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoals().then(() => {
      this.queryParamSub = this._subscribeToQueryParam();
    });
  }

  // methods
  // --------------------------------------------
  unselectGoal(goal: Goal) {
    this.selectedGoals = this.selectedGoals.filter((g) => g != goal);
  }

  selectGoal(goal: Goal) {
    this.selectedGoals.push(goal);
  }

  chooseSelectableGoals(): Goal[] {
    return this.goals.filter((g) => !this.selectedGoals.includes(g));
  }

  async _loadGoals() {
    this.goals = await this.db.getGoals();
  }

  _selectGoal(id: string) {    
    let matchingGoal = this.goals.find((g) => g.id === id);
    if (!matchingGoal) {
      console.error(`${id} not found in this.goals`);
      return;
    }
    this.selectedGoals = [matchingGoal];
  }

  _subscribeToQueryParam(): Subscription {
    return this.route.queryParamMap.subscribe((param) => {
      let goalId = param.get("preselectedGoal");
      if (goalId) {
        this._selectGoal(goalId);
      }
    })
  }
}
