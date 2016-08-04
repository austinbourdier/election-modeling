import 'rxjs/add/operator/map';
import { Http, URLSearchParams } from '@angular/http';
import { Injectable }            from '@angular/core';
import { Observable }            from 'rxjs/Observable';

@Injectable()
export class EngagementService {

  constructor(private http: Http) { }

  getLowOverTimeData(accountId: string, campaignId: string, granularity: string): Observable<number[]> {
    let params = new URLSearchParams();
    params.set('granularity', granularity);
    params.set('minimum', '1');
    params.set('maximum', '5');
    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}/engagement_over_time`,
      {
        search: params
      }
    ).map(res => res.json());
  }

  getMediumOverTimeData(accountId: string, campaignId: string, granularity: string): Observable<number[]> {
    let params = new URLSearchParams();
    params.set('granularity', granularity);
    params.set('minimum', '6');
    params.set('maximum', '15');
    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}/engagement_over_time`,
      {
        search: params
      }
    ).map(res => res.json());
  }

  getHighOverTimeData(accountId: string, campaignId: string, granularity: string): Observable<number[]> {
    let params = new URLSearchParams();
    params.set('granularity', granularity);
    params.set('minimum', '16');
    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}/engagement_over_time`,
      {
        search: params
      }
    ).map(res => res.json());
  }
}
