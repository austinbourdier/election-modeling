import 'rxjs/Rx';
import { Injectable }             from '@angular/core';
import { Http, URLSearchParams }  from '@angular/http';
import { Observable }             from 'rxjs/Observable';

import { Campaign }               from '../models/campaign';
import { CampaignPayload }        from '../models/campaign-payload';


@Injectable()
export class CampaignService {

  private percentCompanyLiftedUrl: string = '/api/kpi-percent-company-lifted.json';
  private awarenessKpiUrl: string = '/api/kpi-awareness.json';
  private reportsUrl: string = '/api/reports.json';

  //TODO: DRY - move this to report.service
  getReportData(): Observable<Campaign[]> {
    return this.http.get(this.reportsUrl)
      .map(res => res.json());
  }

  getCampaignDetail(accountId: string, campaignId: string, nameMatch: string = ''): Observable<Campaign> {

    return this.http.get(`/api/accounts/${accountId}/campaigns/${campaignId}`)
      .map(res => res.json());
  }

  getCampaigns(accountId: string,
               page: string,
               nameMatch: string = '',
               active: string = 'false',
               limit: string = '20'): Observable<CampaignPayload> {
    let params = new URLSearchParams();
    params.set('limit', limit);
    params.set('offset', page);
    params.set('name_match', nameMatch);
    params.set('active', active);

    return this.http.get(`/api/accounts/${accountId}/campaigns`, {search: params})
      .map(res => res.json());
  }

  getPercentCompanyLiftedKpi(): Observable<number[]> {
    return this.http.get(this.percentCompanyLiftedUrl)
      .map(res => res.json());
  }

  getAwarenessKpi(): Observable<number[]> {
    return this.http.get(this.awarenessKpiUrl)
      .map(res => res.json());
  }

  constructor(private http: Http) { }

}
