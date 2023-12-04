import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Discussion, Message, User, placeholder_id, Change } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MainNavService } from 'src/app/services/main-nav.service';
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
    this.routeSub = this.route.paramMap.subscribe(map => {
      const id = map.get("id");
      if (!id) { throw new Error("Missing id route param"); }
      this.api.getDiscussion(id).then(d => this.discussion = d);
      this.chatRoom = this.api.getChatRoom(id);
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
    console.log(payload);
  }

  formIsValid() {
    return (this.content.length && this.discussion) ? true : false;
  }

  send() {
    if (! this.formIsValid()) {
      throw new Error("send() should not be callable if content is empty");
    }
    // post the message asynchronously
    this.chatRoom!.send(this.content);
    // add a placeholder message while waiting for the real one
    this.messages!.unshift(this.makePlaceholderMessage());
    // scroll to the bottom and reset the input
    setTimeout(() => this.mainNav.scrollToBottom(), 0);
    this.content = "";
  }

  replacePlaceholderWithRealMessage(message: Message) {
    const i = this.messages!.findIndex(m => m.id === placeholder_id);
    if (i === -1) {
      throw new Error(`Failed to replace placeholder message with the real one`);
    }
    this.messages![i] = message;
  }

  makePlaceholderMessage(): Message {
    const loggedInUser = this.auth.user$.getValue();
    return {
      id: placeholder_id,
      discussionId: placeholder_id,
      content: this.content,
      author: loggedInUser!,
      date: new Date(),
    }
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
