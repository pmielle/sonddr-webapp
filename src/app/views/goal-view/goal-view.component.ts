import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Goal, Idea } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';

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
  
  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  ideas?: Idea[];
  goal?: Goal;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((map) => {
      const id = map.get("id")!;
      this.api.getGoal(id).then(g => this.goal = g);
      this.api.getIdeas(id).then(i => this.ideas = i);
    })
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

}
