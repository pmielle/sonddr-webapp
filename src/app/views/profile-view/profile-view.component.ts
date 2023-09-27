import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Idea, User } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);
  time = inject(TimeService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  mainNav = inject(MainNavService);

  // attributes
  // --------------------------------------------
  user?: User;
  ideas?: Idea[];
  userSub?: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {

    // get data
    this.userSub = this.auth.user$.subscribe(user => {
      if (!user) { return; }
      this.api.getIdeas("recent", undefined, user.id).then(i => this.ideas = i);
      this.user = user;
    });

    // hide bottom bar
    this.mainNav.hideNavBar();
  }

  ngOnDestroy(): void {

    // unsubscribe
    this.userSub?.unsubscribe();

    // restore bottom bar
    this.mainNav.showNavBar();
  }

  // methods
  // --------------------------------------------
  onSortByChange(sortBy: SortBy) {
    if (!this.user) {
      throw new Error("this.user should be defined at this point");
    }
    this.api.getIdeas(sortBy, undefined, this.user.id).then(i => this.ideas = i);
  }

}
