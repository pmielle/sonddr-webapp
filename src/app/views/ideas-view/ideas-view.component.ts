import { Component, OnInit, inject } from '@angular/core';
import { Goal, Idea } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-ideas-view',
  templateUrl: './ideas-view.component.html',
  styleUrls: ['./ideas-view.component.scss']
})
export class IdeasViewComponent implements OnInit {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);

  
  // attributes
  // --------------------------------------------
  goals?: Goal[];
  ideas?: Idea[];


  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
    this.api.getGoals().then(g => this.goals = g);
    this.api.getIdeas("recent").then(i => this.ideas = i);
  }

  // methods
  // --------------------------------------------
  onSortByChange(sortBy: SortBy) {
    this.api.getIdeas(sortBy).then(i => this.ideas = i);
  }

}
