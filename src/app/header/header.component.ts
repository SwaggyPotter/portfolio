import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
  show = false;

  changeToFalse() {
    this.show = false;
  }

  showInfo() {
    this.show = !this.show;
  }
}
