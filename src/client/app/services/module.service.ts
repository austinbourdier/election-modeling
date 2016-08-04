import 'rxjs/Rx';
import { Injectable }     from '@angular/core';
import { Http, Headers }  from '@angular/http';

import { Module }         from '../models/module';

@Injectable()
export class ModuleService {

  private requestHeaders: Headers;

  constructor(
    private http: Http) {

      this.requestHeaders = new Headers({
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': this.getXsrfCookieValue()
      });
  }

  /**
   * Return observable for all account modules
   *
   * @param {number} accountId [description]
   */
  getModules(accountId: string) {

    return this.http
      .get(this.modulesUrl(accountId))
      .map((res: any) => res.json());
  }

  /**
   * Update account's module attributes
   *
   * @param {number} accountId
   * @param {Module} module
   */
  update(accountId: string, module: Module) {

    return this.http
      .put(this.moduleUrl(accountId, module.slug), JSON.stringify(module),
        { headers: this.requestHeaders })
      .map((res: any) => res.json());
  }

  /**
   * Returns URL for retrieving all modules on an account
   *
   * @param {number} accountId
   */
  private modulesUrl(accountId: string) {

    return `/api/accounts/${accountId}/products.json`;
  }

  /**
   * Returns URL for a single module on an account
   *
   * @param {number} accountId
   * @param {string} moduleSlug
   */
  private moduleUrl(accountId: string, moduleSlug: string) {

    return `/api/accounts/${accountId}/products/${moduleSlug}`;
  }

  /**
   * THIS METHOD IS TEMPORARY UNTIL WE CAN UPGRADE TO RC-4 TO IMPLEMENT THIS
   * FEATURE:
   *
   * https://angular.io/docs/ts/latest/guide/security.html#!#xsrf
   * https://angular.io/docs/ts/latest/api/http/index/HTTP_PROVIDERS-let.html
   *
   * @return {string} [description]
   */
  private getXsrfCookieValue(): string {
    let myWindow: any = window;
    name = 'XSRF-TOKEN';
    name = myWindow.escape(name);
    let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
    let result = regexp.exec(document.cookie);
    return (result === null) ? null : myWindow.unescape(result[1]);
  }

}
