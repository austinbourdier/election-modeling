import 'rxjs/add/operator/map';
import { Injectable }            from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable }            from 'rxjs/Observable';

import { ReportParameters }      from '../models/report-parameters';


@Injectable()
export class URLReportService {
  constructor(private http: Http) { }

  load(args: ReportParameters): Observable<any> {
    let params = new URLSearchParams();
    params.set('offset', args.offset);
    params.set('limit', args.limit.toString());
    params.set('sort_column', args.sortColumn);
    params.set('sort_direction', args.sortDirection);

    //TODO: need mocks for this in /api
    return this.http.get(`/api/accounts/${args.accountId}/campaigns/${args.campaignId}/urls`, {search: params})
      .map(res => res.json());
  }

}
