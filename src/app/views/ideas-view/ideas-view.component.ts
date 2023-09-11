import { Component, OnInit, inject } from '@angular/core';
import { Goal, Idea } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { ApiService } from 'src/app/services/api.service';
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

  
  // attributes
  // --------------------------------------------
  goals?: Goal[];
  ideas?: Idea[];


  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
    this.api.getGoals().then(g => this.goals = g);
    this.api.getIdeas().then(i => this.ideas = i);
  }

  // methods
  // --------------------------------------------
  onSortByChange(sortBy: SortBy) {
    console.log(sortBy);  // TODO: update ideas here
  }

}
