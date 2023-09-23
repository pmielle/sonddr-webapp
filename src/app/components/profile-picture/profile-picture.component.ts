import { Component, Input } from '@angular/core';
import { User } from 'sonddr-shared';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {

  @Input('large') large = false;
  @Input('user') user?: User|null;

}
