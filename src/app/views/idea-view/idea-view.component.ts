import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Idea } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { TimeService } from 'src/app/services/time.service';

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
  time = inject(TimeService);
  screen = inject(ScreenSizeService);
  mainNav = inject(MainNavService);
  
  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  fabClickSub?: Subscription;
  idea?: Idea;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((map) => {
      const id = map.get("id")!;
      this.api.getIdea(id).then(i => this.idea = i);
    });
    this.fabClickSub = this.mainNav.fabClick.subscribe(() => {
      console.log("fab click!");
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.fabClickSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  // ...

}
