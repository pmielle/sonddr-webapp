import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tab } from 'src/app/interfaces/tab';

@Component({
  selector: 'app-tab-icons',
  templateUrl: './tab-icons.component.html',
  styleUrls: ['./tab-icons.component.scss']
})
export class TabIconsComponent {

  // attributes
  // --------------------------------------------
  @Input('tabs') tabs!: Tab[];
  @Input() selected!: Tab;
  @Output() selectedChange = new EventEmitter<Tab>();

  // methods
  // --------------------------------------------
  // ...
}
