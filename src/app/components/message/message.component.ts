import { Component, Input } from '@angular/core';
import { Message } from 'sonddr-shared';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  // I/O
  // --------------------------------------------
  @Input("message") message?: Message;
  @Input("from-user") fromUser?: boolean;

}
