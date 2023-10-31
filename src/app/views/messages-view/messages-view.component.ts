import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Discussion } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);

  
  // attributes
  // --------------------------------------------
  discussions?: Discussion[] = undefined;
  discussionsSub?: Subscription;


  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
    this.api.getDiscussions().subscribe(d => this.discussions = d);  // FIXME: display needs a few seconds
  }

  ngOnDestroy(): void {
    this.discussionsSub?.unsubscribe();
  }

}
