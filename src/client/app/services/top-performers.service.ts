import 'rxjs/add/operator/map';
import { Injectable }            from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable }            from 'rxjs/Observable';


@Injectable()
export class TopPerformersService {

  constructor(private http: Http) { }

  get(accountId: string, campaignId: string): Observable<number[]> {
    let params = new URLSearchParams();
    params.set('limit', '10');
    params.set('offset', '0');
    params.set('sort_column', 'in_flight_pageviews');
    params.set('top_performers', 'true');
    params.set('sort_direction', 'desc');

    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}/companies`,
      {
        search: params
      }
    ).map(res => res.json());
  }

  getOverTimeData(accountId: string, campaignId: string, granularity: string): Observable<number[]> {
    let params = new URLSearchParams();
    params.set('granularity', granularity);
    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}/pageviews_over_time`,
      {
        search: params
      }
    ).map(res => res.json());
  }
}
