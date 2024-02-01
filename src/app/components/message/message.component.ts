import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Message } from 'sonddr-shared';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  // dependencies
  // --------------------------------------------
  http = inject(HttpService);

  // I/O
  // --------------------------------------------
  @Input("message") message?: Message;
  @Input("from-user") fromUser?: boolean;
  @Output("delete") delete = new EventEmitter<void>();

}
