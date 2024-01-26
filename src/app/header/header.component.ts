import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
  show = false;

  constructor(private viewportScroller: ViewportScroller) { }


  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  
  changeToFalse() {
    this.show = false;
  }


  showInfo() {
    this.show = !this.show;
  }
}
