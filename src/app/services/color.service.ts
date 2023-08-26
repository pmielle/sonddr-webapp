import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // methods
  // --------------------------------------------
  makeGoalColor(color: string): string {
    switch (color) {
      case "cyan":
        return "#468981";
      case "green":
        return "#4B8946";
      case "pink":
        return "#89465E";
      case "blue":
        return "#464D89";
      case "yellow":
        return "#898246";
      case "red":
        return "#894646";
      case "purple":
        return "#684689";
      case "orange":
        return "#896246";
      default:
        throw new Error("unimplemented");
    }
  }
}
