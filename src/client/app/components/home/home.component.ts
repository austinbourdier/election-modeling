import { Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'home',
  encapsulation: ViewEncapsulation.None,
  template: '<h1>Welcome home</h1>'
})

export class HomeComponent {
  constructor() {
    //This component is intentionally empty for now
  }
}
