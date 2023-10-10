import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.component.html',
  styleUrls: ['./new-discussion.component.scss']
})
export class NewDiscussionComponent {

  // dependencies
  // --------------------------------------------
  auth = inject(AuthService);
  screen = inject(ScreenSizeService);
  
}
