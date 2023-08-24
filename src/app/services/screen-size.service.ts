import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {

  // dependencies
  // --------------------------------------------
  breakpoints = inject(BreakpointObserver);


  // attributes
  // --------------------------------------------
  mobileMediaQuery = '(max-width: 500px)';
  isMobile = this.checkIsMobile();


  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    this.breakpoints.observe(this.mobileMediaQuery).subscribe(() => {
      this.isMobile = this.checkIsMobile()
    });
  }


  // methods
  // --------------------------------------------
  checkIsMobile(): boolean {
    return this.breakpoints.isMatched(this.mobileMediaQuery);
  }

}
