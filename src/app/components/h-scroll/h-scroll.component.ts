import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-h-scroll',
  templateUrl: './h-scroll.component.html',
  styleUrls: ['./h-scroll.component.scss']
})
export class HScrollComponent implements OnInit, AfterViewInit {

  // attributes
  // --------------------------------------------
  @Input('left-padding') leftPadding: string = "0px";
  @Input('top-padding') topPadding: string = "0px";
  @Input('hide-shadows') hideShadows: boolean = false;
  @ViewChild('container') containerRef!: ElementRef;
  containerElem?: HTMLElement;
  leftShadow = false;
  rightShadow = true;

  // lifecycle hooks
  // --------------------------------------------
  ngOnInit() { }
  
  ngAfterViewInit() {
    this._findContainer();
  }
  
  // methods
  // --------------------------------------------
  onScroll() {
    if (this.containerElem === undefined) {
      console.warn("#container not found, cannot handle scroll. This might happen if scroll happens before _findContainer has run");
      return;
    }
    this._manageShadows(this.containerElem.scrollLeft, this.containerElem.clientWidth, this.containerElem.scrollWidth);
  }

  _manageShadows(scrollLeft: number, width: number, scrollWidth: number) {
    // left
    if (scrollLeft > 0) {
      if (this.leftShadow === false) { this.leftShadow = true; }
    } else {
      if (this.leftShadow === true) { this.leftShadow = false; }
    }
    // right
    if (scrollLeft + width < scrollWidth) {
      if (this.rightShadow === false) { this.rightShadow = true; }
    } else {
      if (this.rightShadow === true) { this.rightShadow = false; }
    }
  }

  _findContainer() {
    this.containerElem = this.containerRef.nativeElement;    
  }
}