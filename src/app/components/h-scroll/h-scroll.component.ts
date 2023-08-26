import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-h-scroll',
  templateUrl: './h-scroll.component.html',
  styleUrls: ['./h-scroll.component.scss']
})
export class HScrollComponent implements OnInit {

  // attributes
  // --------------------------------------------
  @Input('left-padding') leftPadding: string = "0px";
  @Input('top-padding') topPadding: string = "0px";
  @Input('hide-shadows') hideShadows: boolean = false;
  leftShadow = false;
  rightShadow = true;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() { }
  
  // methods
  // --------------------------------------------
  // ...

}