import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Discussion, Message, User } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

const placeholderId = "TBD";

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
    // fetch the real message asynchronously
    this.api.postMessage(this.discussion!.id, this.content).then(async insertedId => {
      const message = await this.api.getMessage(insertedId);
      this.replacePlaceholderWithRealMessage(message);
    });
    // add a placeholder message while waiting for the real one
    if (!this.messages) {
      throw new Error("messages is undefined");
    }
    this.messages.unshift(this.makePlaceholderMessage());
    setTimeout(() => {
      this.mainNav.scrollToBottom();
    }, 0);
    this.content = "";
  }

  replacePlaceholderWithRealMessage(message: Message) {
    if (!this.messages) {
      throw new Error("messages is undefined");
    }
    const i = this.messages.findIndex(m => m.id === placeholderId);    
    if (i === -1) {
      throw new Error(`Failed to replace placeholder message with the real one`);
    }
    this.messages[i] = message;
  }

  makePlaceholderMessage(): Message {
    const loggedInUser = this.auth.user$.getValue();
    if (! loggedInUser) {
      throw new Error("Failed to get logged in user");
    }
    return {
      id: placeholderId,
      discussionId: placeholderId,
      content: this.content,
      author: loggedInUser,
      date: new Date(),
    }
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
