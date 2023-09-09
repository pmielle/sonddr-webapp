import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Goal, Idea } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { ColorService } from 'src/app/services/color.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-goal-view',
  templateUrl: './goal-view.component.html',
  styleUrls: ['./goal-view.component.scss']
})
export class GoalViewComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  screen = inject(ScreenSizeService);
  color = inject(ColorService);
  
  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  ideas?: Idea[];
  goal?: Goal;
  otherGoals?: Goal[];

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((map) => {
      const id = map.get("id")!;
      this.api.getGoal(id).then(g => this.goal = g);
      this.api.getGoals().then(goals => {
        let otherGoals: Goal[] = [];
        let goal: Goal|undefined = undefined;
        goals.forEach(g => {
          if (g.id == id) { goal = g }
          else { otherGoals.push(g) }
        });
        this.otherGoals = otherGoals;
        this.goal = goal;
      });
      this.api.getIdeas(id).then(i => this.ideas = i);
    })
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  makeBackgroundColor(): string {
    return this.goal 
      ? this.color.shadeColor(this.goal.color, -33) 
      : '#303030'
  }

}
