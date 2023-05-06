import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';
import { ScreenSize } from '../interfaces/screen-size';

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnDestroy {

  // dependencies
  // --------------------------------------------
  screenSize$ = new BehaviorSubject<ScreenSize|undefined>(undefined);
  screenSizeSub: Subscription;

  // attributes
  // --------------------------------------------
  // ...

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.screenSizeSub = fromEvent(window, "resize").subscribe(() => {
      let screenSize = this._chooseScreenSize(window.innerWidth);
      this.screenSize$.next(screenSize);           
    });
  }

  ngOnDestroy(): void {
    this.screenSizeSub.unsubscribe();
  }

  // methods
  // --------------------------------------------
  _chooseScreenSize(width: number): ScreenSize {
    if (width <= 700) { return ScreenSize.Small; }
    if (width >= 1200) { return ScreenSize.Large; }
    return ScreenSize.Medium;
  }
}
