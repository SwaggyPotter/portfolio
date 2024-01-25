import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-me-main',
  templateUrl: './me-main.component.html',
  styleUrls: ['./me-main.component.scss']
})
export class MeMainComponent {
  constructor(private viewportScroller: ViewportScroller) { }

  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
