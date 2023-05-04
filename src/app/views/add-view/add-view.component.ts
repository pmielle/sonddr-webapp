import { Component, OnDestroy, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { fadeSlideIn } from 'src/app/animations/in-out';
import { Goal } from 'src/app/interfaces/goal';
import { ideaTab } from 'src/app/interfaces/tab';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';

@Component({
  selector: 'app-add-view',
  templateUrl: './add-view.component.html',
  styleUrls: ['./add-view.component.scss'],
  animations: [fadeSlideIn],
})
export class AddViewComponent implements OnDestroy {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  db = inject(DatabaseService);
  sanitize = inject(DomSanitizer);
  router = inject(Router);
  fab = inject(FabService);
  auth = inject(AuthenticationService);

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
  title: string = "";
  content: string = "";
  fabClickSub: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._loadGoals().then(() => {
      this.queryParamSub = this._subscribeToQueryParam();
    });
    this.fabClickSub = this._subscribeToFabClick();
  }

  ngOnDestroy(): void {
    this.fabClickSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  async submit() {
    // validate inputs
    if (!this.title) {
      console.error("Missing title");
      return;
    }
    if (!this.content) {
      console.error("Missing content");
      return;
    }
    if (this.selectedGoals.length <= 0) {
      console.error("Missing goal(s)");
      return;
    }
    // TODO: handle cover pictures eventually
    // get the current user and set it as author
    let user = await this.auth.getUser();
    if (!user) {
      console.error("Logged in user is not defined");
      return;
    }
    // post
    let goalIds = this.selectedGoals.map(g => g.id);
    let newIdea = await this.db.postIdea(this.title, this.content, goalIds, user.id);
    // redirect
    this.router.navigate(["idea", newIdea.id]);
  }

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

  _onFabClick() {
    this.submit();
  }

  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
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
