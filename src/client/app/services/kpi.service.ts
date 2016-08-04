import 'rxjs/add/operator/map';
import { Injectable }            from '@angular/core';
import { Http }                  from '@angular/http';
import { Observable }            from 'rxjs/Observable';

@Injectable()
export class KPIService {
  constructor(private http: Http) { }

  load(accountId: string, campaignId: string): Observable<any> {
    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}/kpis`)
      .map(res => res.json());
  }

}
