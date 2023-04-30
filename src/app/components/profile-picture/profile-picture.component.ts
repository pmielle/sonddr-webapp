import { Component, Input } from '@angular/core';
import { IUser } from 'src/app/interfaces/i-user';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {
  
  // bindings
  // --------------------------------------------
  @Input('user') user!: IUser;
}
