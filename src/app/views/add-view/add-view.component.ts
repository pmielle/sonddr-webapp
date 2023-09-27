import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, from } from 'rxjs';
import { Goal, Idea } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-add-view',
  templateUrl: './add-view.component.html',
  styleUrls: ['./add-view.component.scss']
})
export class AddViewComponent {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  mainNav = inject(MainNavService);
  
  // attributes
  // --------------------------------------------
  mainSub?: Subscription;
  ideas?: Idea[];
  goals?: Goal[];
  selectedGoals: Goal[] = [];
  selectableGoals: Goal[] = [];
  coverPreview?: string;
  title = "";
  content = "";

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {  
    
    // get data
    this.mainSub = combineLatest([
      this.route.queryParamMap,
      from(this.api.getGoals()),
    ]).subscribe(([map, goals]) => {

      // get all goals
      this.goals = goals;
      this.selectableGoals = goals;

      // preselect a goal if query param
      const id = map.get("preselected");
      if (id) {
        const goal = goals.find(g => g.id === id);
        if (!goal) {
          throw new Error(`Failed to preselect ${id}: no matching goal found`);
        }
        this.selectGoal(goal);
      }
    });

    // hide bottom bar and fab
    this.mainNav.hideNavBar();
    this.mainNav.hideFab();
  }

  ngOnDestroy(): void {

    // unsubscribe
    this.mainSub?.unsubscribe();

    // restore nav bar and fab
    this.mainNav.showNavBar();
    this.mainNav.showFab();
  }

  // methods
  // --------------------------------------------
  uploadCover() {
    console.log("upload cover...");
  }

  refreshFabDispaly() {
    if (this.content && this.title && this.selectedGoals.length) {
      this.mainNav.showFab();
    } else {
      this.mainNav.hideFab();
    }
  }

  selectGoal(goal: Goal) {
    // add it to selected list
    if (! this.selectedGoals.find(g => g.id === goal.id)) {
      this.selectedGoals.unshift(goal);
    }
    // remove it from selectable list
    const i = this.selectableGoals.findIndex(g => g.id === goal.id);
    console.log(i);
    if (i !== -1) {
      console.log(this.selectableGoals.length);
      this.selectableGoals.splice(i, 1);
      console.log(this.selectableGoals.length);
    }
  }

}
