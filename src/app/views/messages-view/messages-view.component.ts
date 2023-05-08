import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Discussion } from 'src/app/interfaces/discussion';
import { messagesTab } from 'src/app/interfaces/tab';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent implements OnDestroy {
  
  // dependencies
  // --------------------------------------------
  db = inject(DatabaseService);
  auth = inject(AuthenticationService);

  // attributes
  // --------------------------------------------
  discussionSub?: Subscription;
  discussions: Discussion[] = [];
  scrollContainer = messagesTab.html;

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this._subscribeToDiscussions();
  }

  ngOnDestroy(): void {
    this.discussionSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  async _subscribeToDiscussions() {
    let user = await this.auth.getUser();
    if (!user) {
      console.error("auth.user is not defined, cannot get its discussions");
      return;
      
    }
    this.discussionSub = this.db.getDiscussions(user.id).subscribe(
      (discussions) => this.discussions = discussions
    );
  }
  
}
