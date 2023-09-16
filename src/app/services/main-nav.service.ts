import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainNavService {

  // dependencies
  // --------------------------------------------
  // ...

  // attributes
  // --------------------------------------------
  hideNavbar = false;
  hideFab = false;
  fabClick = new EventEmitter<void>();

  // lifecycle hooks
  // --------------------------------------------
  constructor() {
    
  }

  // methods
  // --------------------------------------------
  // ...
  
}
