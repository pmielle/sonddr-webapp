import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  // dependencies
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  _scrollContainer: HTMLElement|undefined|null = null;  // null means not reactive
  get scrollContainer() { return this._scrollContainer; }
  @Input('scroll-container') set scrollContainer(value: HTMLElement|undefined|null) { 
    this._scrollContainer = value;     
    this._onScrollContainerChange();
  }
  @Input('header-color') headerColor: string = "var(--background-color)";
  containerScrollSub?: Subscription;
  scrolled = false;  // updated in scrollContainer scroll

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }
  ngOnInit() { }

  ngOnDestroy() {
    this.containerScrollSub?.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _onScrollContainerChange() {
    if (this.scrollContainer) {
      // init based on initial scroll
      this._onContainerScroll(this.scrollContainer.scrollTop);
      // and react to future scroll events
      this.containerScrollSub = fromEvent(this.scrollContainer, "scroll").subscribe(
        (e: Event) => this._onContainerScroll((e.target as HTMLElement).scrollTop)
      );
    }
  }

  _onContainerScroll(offset: number) {
    if (offset <= 0) {
      if (this.scrolled === true) { this.scrolled = false; }
    } else {
      if (this.scrolled === false) { this.scrolled = true; }
    }
  }

}
