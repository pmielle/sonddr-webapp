import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comment, Idea, User } from 'sonddr-shared';
import { SortBy } from 'src/app/components/idea-list/idea-list.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { TimeService } from 'src/app/services/time.service';

const placeholderId = "TBD";

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
  auth = inject(AuthService);
  
  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  fabClickSub?: Subscription;
  idea?: Idea;
  comments?: Comment[];

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((map) => {
      const id = map.get("id")!;
      this.api.getIdea(id).then(i => this.idea = i);
      this.api.getComments("recent", id, undefined).then(c => this.comments = c);
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
  postComment(body: string) {
    if (!this.idea) { throw new Error("Cannot post comment if idea is not loaded"); }
    if (!this.comments) { throw new Error("Cannot post comment if comments are not loaded"); }
    const placeholderComment = this.makePlaceholderComment(body, this.idea.id);
    const newComments = [...this.comments];  // otherwise same reference, and @Input is not updated
    newComments.unshift(placeholderComment);
    this.comments = newComments;
    this.api.postComment(this.idea.id, body).then(async insertedId => {
      const comment = await this.api.getComment(insertedId); 
      this.replacePlaceholderComment(comment);
    });
  }

  makePlaceholderComment(body: string, ideaId: string): Comment {
    const user = this.auth.user$.getValue();
    if (!user) { throw new Error("Cannot post comment if user is not logged in"); }
    return {
      id: placeholderId,
      ideaId: ideaId, 
      content: body,
      author: user,
      rating: 0,
      date: new Date(),
    };
  }

  replacePlaceholderComment(comment: Comment) {
    if (!this.comments) { throw new Error("Cannot replace placeholder comment if comments is undefined"); }
    const indexOfPlaceholder = this.comments.findIndex(c => c.id === placeholderId);
    if (indexOfPlaceholder === -1) { throw new Error(`Found no comment with id ${placeholderId}`); }
    const newComments = [...this.comments];  // otherwise same reference, and @Input is not updated
    newComments[indexOfPlaceholder] = comment;
    this.comments = newComments;
  }

  onSortByChange(sortBy: SortBy) {
    if (!this.idea) {
      throw new Error("this.idea should be defined at this point");
    }
    this.api.getComments(sortBy, this.idea.id, undefined).then(c => this.comments = c);
  }

}
