import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeSlideInOut } from 'src/app/animations/in-out';
import { Tab } from 'src/app/interfaces/tab';

@Component({
  selector: 'app-tab-icons',
  templateUrl: './tab-icons.component.html',
  styleUrls: ['./tab-icons.component.scss'],
  animations: [
    fadeSlideInOut,
  ],
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
