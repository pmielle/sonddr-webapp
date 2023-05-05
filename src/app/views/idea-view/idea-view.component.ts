import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CommentOrderBy, IComment } from 'src/app/interfaces/i-comment';
import { Idea } from 'src/app/interfaces/idea';
import { ideaTab } from 'src/app/interfaces/tab';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FabService } from 'src/app/services/fab.service';
import { IRouterService } from 'src/app/services/i-router.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-idea-view',
  templateUrl: './idea-view.component.html',
  styleUrls: ['./idea-view.component.scss']
})
export class IdeaViewComponent implements OnDestroy {

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
  idea?: Idea;
  comments: IComment[] = [];
  _commentOrderBy = CommentOrderBy.Date;
  get commentOrderBy() { return this._commentOrderBy; }
  set commentOrderBy(value) {    
    this._commentOrderBy = value;    
    this._onCommentOrderByChange();
  }
  fabClickSub: Subscription;
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
  async _onCommentOrderByChange() {
    this._refreshComments();
  }

  async _refreshComments() {
    if (this.idea === undefined) {
      console.error("idea is undefined, cannot get its comments");
      return;
    }    
    this.comments = await this.db.getComments(this.idea.id, this.commentOrderBy);
  }

  _initialLoad() {    
    this._loadIdea().then(() => {
      this._loadComments();
    }).catch((err) => {
      console.error(`_loadIdea failed, cannot continue the initial loading of the page: ${err}`);
      return;
    });
  }

  async _loadComments() {
    if (this.idea === undefined) {
      console.error("idea is undefined, cannot get its comments");
      return;
    }    
    this.comments = await this.db.getComments(this.idea.id, this.commentOrderBy);
  }

  _reload() {
    this.idea = undefined;
    this._initialLoad();
  }

  _onFabClick() {
    console.log("click....");
  }
  
  _subscribeToFabClick(): Subscription {
    return this.fab.click$.pipe(filter(t => t === ideaTab)).subscribe(
      () => { this._onFabClick(); }
    );
  }

  _loadIdea(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let ideaId = this.route.snapshot.paramMap.get("id");
      if (!ideaId) {
        reject("Failed to get \"id\" from paramMap: cannot get the id of the idea to display");
        return;
      }
      this.idea = await this.db.getIdea(ideaId);
      if (!this.idea) {
        reject(`Failed to get idea ${ideaId}`);
        return;
      }
      resolve();
    });
  }
}
