import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, from } from 'rxjs';
import { Goal, Idea } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
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
  
  // attributes
  // --------------------------------------------
  mainSub?: Subscription;
  ideas?: Idea[];
  goals?: Goal[];
  selectedGoals = new Set<Goal>();

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.api.getGoals().then(g => this.goals = g);
    
    this.mainSub = combineLatest([
      this.route.queryParamMap,
      from(this.api.getGoals()),
    ]).subscribe(([map, goals]) => {

      // get all goals
      this.goals = goals;

      // preselect a goal if query param
      const id = map.get("preselected");
      if (id) {
        const goal = goals.find(g => g.id === id);
        if (!goal) {
          throw new Error(`Failed to preselect ${id}: no matching goal found`);
        }
        this.selectedGoals.add(goal);
      }
    })
  }

  ngOnDestroy(): void {
    this.mainSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  // ...

}
