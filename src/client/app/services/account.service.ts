import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Injectable }     from '@angular/core';
import { Http, Headers }  from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { Observable }     from 'rxjs/Observable';

import { Account }        from '../models/account';
import { AccountPayload } from '../models/account-payload';


@Injectable()
export class AccountService {
  private _accounts$: Subject<Account[]>;
  private baseUrl = '/api';
  private dataStore: {
    accounts: Account[];
  };

  private requestHeaders: Headers;

  constructor(private http: Http) {
    this.dataStore = { accounts: [] };
    this._accounts$ = <Subject<Account[]>>new Subject();

    this.requestHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': this.getXsrfCookieValue()
    });
  }

  get all$() {
    return this._accounts$.asObservable();
  }

  find$(id: any) {
    if(!this.dataStore.accounts[id]) {
      this.load(id);
    }
    return this.all$
      .map(items => items
        .find(item => item.id.toString() === id.toString())
      );
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/accounts.json`)
      .map(res => res.json())
      .subscribe(results => {
        this.dataStore.accounts = results.data;
        // Push a new copy to all subscribers
        this._accounts$.next(this.dataStore.accounts);
      }, error => console.log(error));
  }

  load(id: any) {
    this.http.get(`${this.baseUrl}/accounts/${id}.json`)
      .map(res => res.json())
      .subscribe(data => {
        this.dataStore.accounts[data.id] = data;

        //Emit array of last value retrieved to all subscribers
        this._accounts$.next([this.dataStore.accounts[data.id]]);
      }, error => console.log(error));

  }

  getAccounts(): Observable<AccountPayload> {
    return this.http.get('/api/accounts').map(res => res.json());
  }

  create(account: Account) {

    return Observable.create((observer:any) => {

      this.http.post(`${this.baseUrl}/accounts`, JSON.stringify(account),
        { headers: this.requestHeaders })
        .map(response => response.json())
        .subscribe(
          (data) => {
            this.dataStore.accounts.push(data);
            this._accounts$.next(this.dataStore.accounts);
            observer.next(data);
            observer.complete();
          },
          (error) => {
            observer.error(error);
            observer.complete();
          }
        );
      }
    );
  }

  update(account: Account) {
    this.http.put(`${this.baseUrl}/accounts/${account.id}`, JSON.stringify(account))
      .map(response => response.json()).subscribe(data => {
        this.dataStore.accounts.forEach((account, i) => {
          if (account.id === data.id) {
            this.dataStore.accounts[i] = data;
          }
        });

        this._accounts$.next(this.dataStore.accounts);
      }, error => console.log(error));
  }

  remove(accountId: any) {
    this.http.delete(`${this.baseUrl}/accounts/${accountId}`)
      .subscribe(response => {
        this.dataStore.accounts.forEach((t, i) => {
          if (t.id.toString() === accountId.toString()) {
            this.dataStore.accounts.splice(i, 1);
          }
        });
        this._accounts$.next(this.dataStore.accounts);
      }, error => console.log(error));
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
  getXsrfCookieValue(): string {
    let myWindow: any = window;
    name = 'XSRF-TOKEN';
    name = myWindow.escape(name);
    let regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
    let result = regexp.exec(document.cookie);
    return (result === null) ? null : myWindow.unescape(result[1]);
  }
}
