import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-h-scroll',
  templateUrl: './h-scroll.component.html',
  styleUrls: ['./h-scroll.component.scss']
})
export class HScrollComponent {

  // attributes
  // --------------------------------------------
  @Input('hide-shadows') hideShadows: boolean = false;
  leftShadow = false;
  rightShadow = true;

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  
  // methods
  // --------------------------------------------
  // ...

}