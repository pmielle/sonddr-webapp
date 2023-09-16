import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Idea } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-idea-view',
  templateUrl: './idea-view.component.html',
  styleUrls: ['./idea-view.component.scss']
})
export class IdeaViewComponent implements OnDestroy {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  
  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  idea?: Idea;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((map) => {
      const id = map.get("id")!;
      this.api.getIdea(id).then(i => this.idea = i);
    })
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  // ...

}
