import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeSlideIn } from 'src/app/animations/in-out';
import { Goal } from 'src/app/interfaces/goal';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-view',
  templateUrl: './add-view.component.html',
  styleUrls: ['./add-view.component.scss'],
  animations: [fadeSlideIn],
})
export class AddViewComponent {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  db = inject(DatabaseService);
  sanitize = inject(DomSanitizer);

  // attributes
  // --------------------------------------------
  queryParamSub?: Subscription;
  goals: Goal[] = [];
  selectedGoals: Goal[] = [];
  _cover?: File = undefined;
  get cover() { return this._cover; } 
  set cover(value) {
    this._cover = value;
    this.updateCoverUrl();
  }
  coverUrl?: SafeResourceUrl;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoals().then(() => {
      this.queryParamSub = this._subscribeToQueryParam();
    });
  }

  // methods
  // --------------------------------------------
  updateCoverUrl() {
    if (!this.cover) {
      this.coverUrl = undefined;
      return;
    }
    let url = URL.createObjectURL(this.cover);
    let unsafeUrl = this.sanitize.bypassSecurityTrustResourceUrl(url);
    this.coverUrl = unsafeUrl;
  }

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
