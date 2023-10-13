import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Discussion, Message, User } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-discussion-view',
  templateUrl: './discussion-view.component.html',
  styleUrls: ['./discussion-view.component.scss']
})
export class DiscussionViewComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);
  mainNav = inject(MainNavService);
  
  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  discussion?: Discussion;
  messages?: Message[];
  content: string = "";

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.mainNav.flattenNavBar();
    this.routeSub = this.route.paramMap.subscribe(map => {
      const id = map.get("id");
      if (!id) { throw new Error("Missing id route param"); }
      this.api.getDiscussion(id).then(d => this.discussion = d);
      this.api.getMessages(id).then(m => {
        this.messages = m;
        setTimeout(() => this.mainNav.scrollToBottom(), 0);
      }); 
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.mainNav.restoreNavBar();
  }

  // methods
  // --------------------------------------------
  formIsValid() {
    return (this.content.length && this.discussion) ? true : false;
  }

  send() {
    if (! this.formIsValid()) {
      throw new Error("send() should not be callable if content is empty");
    }
    const loggedInUser = this.auth.user$.getValue();
    if (! loggedInUser) {
      throw new Error("Failed to get logged in user");
    }
    this.api.postMessage(this.discussion!.id, this.content);  // TODO: get the real message and replace the dummy one
    this.messages?.unshift({
      id: "TBD",
      discussionId: "TBD",
      content: this.content,
      author: loggedInUser,
      date: new Date(),
    });
    setTimeout(() => {
      this.mainNav.scrollToBottom();
    }, 0);
    this.content = "";
  }

  shouldHaveSpacer(i: number): boolean {
    const message = this.messages?.[i];
    const previousMessage = this.messages?.[i - 1];
    if (!message) { throw new Error(`Failed to get message with index ${i}`); }
    if (!previousMessage) { return false; }
    const fromSameAuthor = message.author.id === previousMessage.author.id;
    return !fromSameAuthor;
  }

  findOtherUser(loggedInUser: User|undefined|null): User|undefined {
    if (!this.discussion) { return undefined; }
    if (!loggedInUser) { return undefined; }
    let otherUsers = this.discussion.users.filter(u => u.id !== loggedInUser.id);
    if (!otherUsers.length) { 
      throw new Error(`Failed to find another user for discussion ${this.discussion.id}`); 
    }
    if (otherUsers.length > 1) {
      console.warn("Display of more than 1 other user is not yet supported: using the first one");
    }
    return otherUsers[0];
  }

}
