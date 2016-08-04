import { async, inject } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/core/testing';
import { By }             from '@angular/platform-browser';
import { ViewContainerRef }   from '@angular/core';

import { AppComponent } from './app.component';

export function main() {

  describe('Smoke test', () => {
    it('should run a passing test', () => {
      expect(true).toEqual(true, 'should always pass');
    });
  });

  describe('new AppComponent', function () {
    it('should instantiate component', () => {
      let vcr: ViewContainerRef;
      expect(new AppComponent(vcr)).toBeDefined('Whoopie!');
    });
  });
}

describe('AppComponent with TCB', function () {

  it('should instantiate component',
    async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {

    restoreOriginalAppComponent(tcb) // was `tcb`
      .createAsync(AppComponent).then(fixture => {
        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
      })
      .catch(err => {
        console.error(err);
        throw(err);
      });
  })));

  it('should have expected <h1> text',
    async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {

      restoreOriginalAppComponent(tcb)
        .createAsync(AppComponent).then(fixture => {
          // fixture.detectChanges();  // would need to resolve a binding but we don't have a binding

          let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;  // it works

              h1 = fixture.debugElement.query(By.css('h1')).nativeElement;            // preferred

          expect(h1.innerText).toMatch(/angular 2 app/i, '<h1> should say something about "Angular 2 App"');
        });

  })));
});


function restoreOriginalAppComponent(tcb: TestComponentBuilder) {
   return tcb.overrideTemplate( AppComponent, '<h1>My First Angular 2 App</h1>');
    //.overrideProviders(AppComponent, [{ provide: CustomerService, useValue: {} }]);
}
