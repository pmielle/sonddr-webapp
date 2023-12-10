import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { User, Idea } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  http = inject(HttpService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  time = inject(TimeService);
  router = inject(Router);

  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  user?: User;
  ideas?: Idea[];

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = combineLatest([this.route.paramMap, this.auth.user$]).subscribe(
      ([map, user]) => {
        const id = map.get("id")!;
        if (id === user?.id) {
          this.router.navigateByUrl("/ideas/profile", {replaceUrl: true});
          return;
        }
        this.http.getUser(id).then(u => this.user = u);
        this.http.getIdeas("recent", undefined, id).then(i => this.ideas = i);
      }
    );
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  onSortByChange(sortBy: SortBy) {
    if (!this.user) {
      throw new Error("this.user should be defined at this point");
    }
    this.http.getIdeas(sortBy, undefined, this.user.id).then(i => this.ideas = i);
  }

}
