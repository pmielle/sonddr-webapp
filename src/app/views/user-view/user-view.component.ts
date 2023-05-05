import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';
import { Idea, IdeaOrderBy } from 'src/app/interfaces/idea';
import { ideaTab } from 'src/app/interfaces/tab';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';
import { IRouterService } from 'src/app/services/i-router.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {

  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  fab = inject(FabService);
  route = inject(ActivatedRoute);
  tab = inject(TabService);
  auth = inject(AuthenticationService);
  irouter = inject(IRouterService);

  // attributes
  // --------------------------------------------
  user?: IUser;
  ideas: Idea[] = [];
  fabClickSub: Subscription;
  _ideaOrderBy = IdeaOrderBy.Date;
  get ideaOrderBy() { return this._ideaOrderBy; }
  set ideaOrderBy(value) {    
    this._ideaOrderBy = value;
    this._onideaOrderByChange();
  }
  isLoggedIn = false;
  sameUrlNavigationSub = this.irouter.onSameUrlNavigation$.subscribe(() => this._reload());

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._initialLoad();
    this.fabClickSub = this._subscribeToFabClick();
  }

  ngOnDestroy(): void {
    this.fabClickSub.unsubscribe();
    this.sameUrlNavigationSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _initialLoad() {
    this._loadUser().then(() => {
      this._setIsLoggedIn();
      this._loadIdeas();
    });
  }

  _reload() {
    this.ideas = [];
    this.user = undefined;
    this._ideaOrderBy = IdeaOrderBy.Date;
    this.isLoggedIn = false;
    this._initialLoad();
  }

  async _setIsLoggedIn() {
    if (!this.user) {
      console.error("this.user is undefined, cannot determine if their are logged in");
      return;
    }
    let loggedInUser = await this.auth.getUser();
    let isLoggedIn = this.user.id === loggedInUser?.id;
    this.isLoggedIn = isLoggedIn;
  }

  async _onideaOrderByChange() {
    this._refreshIdeas();
  }

  async _refreshIdeas() {
    if (!this.user) {
      console.error("this.user is undefined, cannot refresh their ideas");
      return;
    }
    this.ideas = await this.db.getIdeasFromUser(this.user.id, this.ideaOrderBy);
  }

  _onFabClick() {
    console.log("click....");
  }
  
  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
  }

  async _loadIdeas() {
    if (!this.user) {
      console.error("this.user is undefined, cannot refresh their ideas");
      return;
    }
    this.ideas = await this.db.getIdeasFromUser(this.user.id, this.ideaOrderBy);
  }

  async _loadUser() {
    this.user = await new Promise<IUser>(async (resolve, reject) => {
      let userId = this.route.snapshot.paramMap.get("id");
      if (!userId) {
        reject("Failed to get \"id\" from paramMap: cannot get the id of the user to display");
        return;
      }
      let user = await this.db.getUser(userId);
      if (!user) {
        reject(`Failed to get user ${userId}`);
        return;
      }
      resolve(user);
    });
  }
}
