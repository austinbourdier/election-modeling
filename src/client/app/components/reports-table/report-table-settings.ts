export class ReportHeader {
  attribute: string;
  title: string;
  sort: boolean;
}

export class ReportSetting {
  title: string;
  name: string;
  headers: ReportHeader[];
}

export class ReportSettings {
  private _settings = [
      {
        title: 'Company Report',
        name: 'company',
        headers: [
          {attribute: 'name', title: 'Company', sort: true, width: 'col-md-3'},
          {attribute: 'baseline_pageviews', title: 'Baseline Page Views', sort: true, width: 'col-md-2'},
          {attribute: 'off_corporate_pageviews', title: 'Off Corporate', sort: true, width: 'col-md-2'},
          {attribute: 'in_flight_pageviews', title: 'Page Views', sort: true, width: 'col-md-2'},
          {attribute: 'lift_percentage', title: 'Lift %', sort: false, width: 'col-md-2'},
          {attribute: 'is_new', title: 'Net New', sort: false, width: 'col-md-1'}
        ]
      },
      {
        title: 'URL Report',
        name: 'url',
        headers: [
          {attribute: 'url', title: 'URL', sort: false, width: 'col-md-6'},
          {attribute: 'baseline_pageviews', title: 'Baseline Pageviews', sort: true, width: 'col-md-2'},
          {attribute: 'in_flight_pageviews', title: 'Page Views', sort: true, width: 'col-md-2'},
          {attribute: 'lift_percentage', title: 'Lift %', sort: false, width: 'col-md-2'}
        ]
      }
    ];

  get all() {
    return this._settings;
  }
}
