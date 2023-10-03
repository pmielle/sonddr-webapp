import { Component, inject } from '@angular/core';
import { Discussion } from 'sonddr-shared';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent {

  // dependencies
  // --------------------------------------------
  api = inject(ApiService);
  screen = inject(ScreenSizeService);
  auth = inject(AuthService);

  
  // attributes
  // --------------------------------------------
  discussions?: Discussion[] = undefined;


  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() {
    this.api.getDiscussions().then(d => this.discussions = d);
  }

}
