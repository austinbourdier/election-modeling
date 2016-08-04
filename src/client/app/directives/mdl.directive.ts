import { Directive, AfterViewInit } from '@angular/core';
declare var componentHandler: any;

@Directive({
  selector: '[mdl]'
})

/**
 * Make Material Design Lite components dynamic and compatible with ng2
 * is necessary in order to "augment" dynamically added HTML
 * @see http://stackoverflow.com/a/35451821/1341825
 * @see https://gist.github.com/tbassetto/fa36518660cfcc7e0b62
 */
export class MDLDirective implements AfterViewInit {
  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }
}

