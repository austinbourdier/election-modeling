import 'rxjs/Rx';
import { Injectable }     from '@angular/core';
import { Http, Headers }  from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Subject }        from 'rxjs/Subject';

import { User }           from '../models/user';

@Injectable()
export class UserService {
  private _users$: Subject<User[]>;
  private baseUrl = '/api';
  private dataStore: { // this stores users in-memory
    users: User[]
  };
  private requestHeaders: Headers;


  constructor(private http: Http) {
    this.dataStore = { users: [] };
    this._users$ = <Subject<User[]>>new Subject();

    this.requestHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': this.getXsrfCookieValue()
    });
  }

  get all$() {
    return this._users$.asObservable();
  }

  find$(id: any) {
    if((!this.dataStore.users[id])) {
      this.load(id);
    }
    return this.all$
      .map(items => items
        .find(item => item.id.toString() === id.toString())
      );
  }

  currentUser() {
    return this.http.get(`${this.baseUrl}/user.json`)
      .map(res => res.json());
  }

  findByAccountId(accountId: string) {
    //this.loadAll(); // TODO: should this be "live" or just return in-memory?
    return this.all$.map(users => users.filter(item => item.account_id.toString() === accountId.toString()));
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/users.json`)
      .map(res => res.json())
      .subscribe(response => {
        this.dataStore.users = response.data;
        // Push a new copy to all subscribers
        this._users$.next(this.dataStore.users);
      }, error => console.log(error));
  }

  load(id: any) {
    this.http.get(`${this.baseUrl}/users/${id}.json`)
      .map(res => res.json())
      .subscribe(data => {
        this.dataStore.users[data.id] = data;

        //Emit array of last value retrieved to all subscribers
        this._users$.next([this.dataStore.users[data.id]]);
      }, error => console.log(error)
    );
  }

  create(user: User) {
    return Observable.create((observer: any) => {
      this.http.post(`${this.baseUrl}/accounts/${user.account_id}/users`, JSON.stringify(user), { headers: this.requestHeaders })
        .map(response => response.json())
        .subscribe(
          data => {
            this.dataStore.users.push(data);
            this._users$.next(this.dataStore.users);
            observer.next(data);
            observer.complete();
          },
          error => console.log(error));
    });
  }

  update(user: User) {
    return Observable.create((observer: any) => {
      this.http.put(`${this.baseUrl}/accounts/${user.account_id}/users/${user.id}`, JSON.stringify(user), { headers: this.requestHeaders })
        .map(response => response.json())
        .subscribe(
          data => {
            this.dataStore.users.forEach((user, i) => {
              if (user.id === data.id) {
                this.dataStore.users[i] = data;
              }
            });
            this._users$.next(this.dataStore.users);
            observer.next(data);
            observer.complete();
          },
          error => console.log(error));
    });
  }

  remove(userId: any) {
    return Observable.create((observer: any) => {
      this.http.delete(`${this.baseUrl}/users/${userId}`, { headers: this.requestHeaders })
      // TODO: should be:
      // this.http.delete(`${this.baseUrl}/accounts/${user.account_id}/users/${userId}`, { headers: this.requestHeaders })
      // Need accountId here
        .subscribe(response => {
          this.dataStore.users.forEach((t, i) => {
            if (t.id.toString() === userId.toString()) {
              this.dataStore.users.splice(i, 1);
            }
          });
          this._users$.next(this.dataStore.users);
        }, error => console.log(error));
    });
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
