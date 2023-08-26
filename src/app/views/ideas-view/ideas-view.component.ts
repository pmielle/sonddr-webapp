import { Component, OnInit, inject } from '@angular/core';
import { Goal } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ideas-view',
  templateUrl: './ideas-view.component.html',
  styleUrls: ['./ideas-view.component.scss']
})
export class IdeasViewComponent implements OnInit {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);

  
  // attributes
  // --------------------------------------------
  goals?: Goal[] = undefined;


  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
    this.api.getGoals().then(g => this.goals = g);
  }

}
