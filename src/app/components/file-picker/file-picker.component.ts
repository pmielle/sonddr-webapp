import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss']
})
export class FilePickerComponent {

  // attributes
  // --------------------------------------------
  @Input('label') label!: string;
  @Input('color') color: string = "transparent";
  @Output('file-change') fileChange = new EventEmitter<File>();
  @ViewChild('input') input?: ElementRef;

  // methods
  // --------------------------------------------
  clickInput() {
    let inputElem = this.input?.nativeElement as HTMLInputElement;
    if (!inputElem) {
      console.error("Viewchild #input not found: cannot click it");
      return;
    }
    inputElem.click();
  }

  resetInput() {
    let inputElem = this.input?.nativeElement as HTMLInputElement;
    if (!inputElem) {
      console.error("Viewchild #input not found: cannot reset it");
      return;
    }
    inputElem.value = "";
  }

  onChange(e: Event) {
    let file = (e.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.fileChange.next(file);
      this.resetInput();
    }
  }

}
