import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ROUTER_DIRECTIVES }                              from '@angular/router';
import { MDLDirective }                                   from './directives/mdl.directive';

import { NavbarComponent }                                from './components/navbar/navbar.component';



@Component({
  selector: 'matador',
  templateUrl: 'app/app.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, MDLDirective],
  encapsulation: ViewEncapsulation.None
})


export class AppComponent {
  public viewContainerRef: ViewContainerRef;

  constructor(viewContainerRef: ViewContainerRef) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }
}
