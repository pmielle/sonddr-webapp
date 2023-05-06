import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { upvotedMode } from 'src/app/interfaces/fab-mode';
import { IComment, defaultCommentOrderBy } from 'src/app/interfaces/i-comment';
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
  _commentOrderBy = defaultCommentOrderBy;
  get commentOrderBy() { return this._commentOrderBy; }
  set commentOrderBy(value) {
    this._commentOrderBy = value;
    this._refreshComments();
  }
  fabClickSub: Subscription;
  sameUrlNavigationSub = this.irouter.onSameUrlNavigation$.subscribe(() => this._reload());
  hasUpvoted?: boolean;

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
      this._checkHasUpvoted();
      this._loadComments();
    }).catch((err) => {
      console.error(`_loadIdea failed, cannot continue the initial loading of the page: ${err}`);
      return;
    });
  }

  async _checkHasUpvoted() {
    if (!this.idea) {
      console.error("idea is undefined, cannot upvote it");
      return;
    }  
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot upvote");
      return;
    }
    this.hasUpvoted = await this.db.hasUpvotedIdea(this.idea.id, user.id);
    if (this.hasUpvoted) {
      this.fab.pushToModeStack(upvotedMode);
    }
  }

  async _loadComments() {
    if (!this.idea) {
      console.error("idea is undefined, cannot get its comments");
      return;
    }    
    this.comments = await this.db.getComments(this.idea.id, this.commentOrderBy);
  }

  _reload() {
    this.idea = undefined;
    this._initialLoad();
  }

  async _onFabClick() {
    if (this.hasUpvoted === undefined) {
      console.error("this.hasUpvotes is undefined: cannot choose wether to upvote or remove existing upvote");
      return;
    }
    if (this.hasUpvoted) {
      this._removeUpvote();
    } else {
      this._upvote();
    }
  }

  async _removeUpvote() {
    if (!this.idea) {
      console.error("idea is undefined, cannot upvote it");
      return;
    }  
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot upvote");
      return;
    }
    this.hasUpvoted = false;
    this.fab.popModeStack();
    this.db.deleteIdeaUpvote(this.idea.id, user.id);
  }
  
  async _upvote() {
    if (!this.idea) {
      console.error("idea is undefined, cannot upvote it");
      return;
    }  
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is undefined, cannot upvote");
      return;
    }
    this.hasUpvoted = true;
    this.fab.pushToModeStack(upvotedMode);
    this.db.upvoteIdea(this.idea.id, user.id);
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
