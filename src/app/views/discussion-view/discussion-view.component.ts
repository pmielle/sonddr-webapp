import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Discussion, Message, User, Change } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
import { RealTimeService } from 'src/app/services/real-time.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { ChatRoom } from 'src/app/types/chat-room';


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
  realTime = inject(RealTimeService);

  // attributes
  // --------------------------------------------
  routeSub?: Subscription;
  discussion?: Discussion;
  messages?: Message[];
  content: string = "";
  chatRoom?: ChatRoom;
  chatRoomSub?: Subscription;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit(): void {
    this.mainNav.flattenNavBar();
    this.routeSub = this.route.paramMap.subscribe(async map => {
      const id = map.get("id");
      if (!id) { throw new Error("Missing id route param"); }
      await this.api.getDiscussion(id).then(d => this.discussion = d); // needs to be await-ed otherwise scrollToBottom does not work
      this.chatRoom = await this.realTime.getChatRoom(id);
      this.chatRoomSub = this.chatRoom.listen().subscribe(
        (payload) => this.onChatRoomUpdate(payload)
      );
    });
  }

  ngOnDestroy(): void {
    this.mainNav.restoreNavBar();
    this.routeSub?.unsubscribe();
    this.chatRoomSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  onChatRoomUpdate(payload: Message[]|Change<Message>) {
    if (this.api.isChange(payload)) {
      const change = payload as Change<Message>;
      switch (change.type) {
        case "insert": {
          this.messages!.unshift(change.payload!);
          this.mainNav.scrollToBottom();
          break;
        }
        case "update": {
          const index = this.findIndex(change.docId);
          this.messages![index] = change.payload!;
          break;
        }
        case "delete": {
          const index = this.findIndex(change.docId);
          this.messages!.splice(index, 1);
          break;
        }
      }
    } else {
      this.messages = payload as Message[];
      this.mainNav.scrollToBottom(); // does not work for some weird timing reason
    }
  }

  findIndex(id: string): number {
    const index = this.messages!.findIndex(m => m.id === id);
    if (index === -1) { throw new Error(`Failed to find message ${id}`); }
    return index;
  }

  formIsValid() {
    return (this.content.length && this.discussion) ? true : false;
  }

  send() {
    if (! this.formIsValid()) {
      throw new Error("send() should not be callable if content is empty");
    }
    // post the message asynchronously
    const placeholder = this.chatRoom!.send(
      this.content,
      this.auth.user$.getValue()!
    );
    // add a placeholder message while waiting for the real one
    this.messages!.unshift(placeholder);
    // scroll to the bottom and reset the input
    this.mainNav.scrollToBottom();
    this.content = "";
  }

  shouldHaveSpacer(i: number): boolean {
    const message = this.messages![i];
    const previousMessage = this.messages?.[i - 1];
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
