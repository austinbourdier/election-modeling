import { Component,
         Input,
         OnInit,
         ViewEncapsulation }                 from '@angular/core';
import { NgSwitch,
         NgSwitchCase,
         NgSwitchDefault,
         CORE_DIRECTIVES
       }                                     from '@angular/common';
import { MdProgressCircle, MdSpinner }       from '@angular2-material/progress-circle/progress-circle';

import { PaginatePipe,
         PaginationControlsCmp,
         PaginationService }                 from 'ng2-pagination';
import { DROPDOWN_DIRECTIVES }               from 'ng2-bootstrap/ng2-bootstrap';


import { CompanyReportService }              from '../../services/company-report.service';
import { DataTableDirective, SortEvent }     from '../../directives/datatable/datatable.directive';
import { ColumnSorterComponent }             from '../../directives/datatable/sorter.component';
import { ReportTable }                       from '../../models/report-table';
import { ReportSettings,
         ReportSetting,
         ReportHeader }                      from './report-table-settings';
import { ReportParameters }                  from '../../models/report-parameters';
import { URLReportService }                  from '../../services/url-report.service';



@Component({
  selector: 'reports-table',
  encapsulation: ViewEncapsulation.None,
  directives: [PaginationControlsCmp, DataTableDirective, DROPDOWN_DIRECTIVES, CORE_DIRECTIVES,
               MdProgressCircle, MdSpinner, NgSwitch, NgSwitchCase, NgSwitchDefault, ColumnSorterComponent],
  providers: [URLReportService, CompanyReportService, PaginationService, DataTableDirective, ReportSettings],
  pipes: [PaginatePipe],
  templateUrl: 'app/components/reports-table/reports-table.html',
  styleUrls: ['app/components/reports-table/reports-table.css']
})

export class ReportsTableComponent implements OnInit {
  @Input() accountId: string;
  @Input() campaignId: string;

  reports: ReportSetting[];
  selectedReport: any;
  selectedReportTitle: string;
  reportHeaders: ReportHeader;
  reportData: ReportTable[] = [];

  p: number = 1;
  limit: number = 20;
  total: number;
  sortColumn: string = 'in_flight_pageviews';
  sortDirection: string = 'desc';

  dropdownStatus:{isopen:boolean} = {isopen: false};

  constructor(
    public reportSettings: ReportSettings,
    public urlReportService: URLReportService,
    public companyReportService: CompanyReportService,
    private dataTable: DataTableDirective) {
      this.reports = reportSettings.all;
      dataTable.onSortChange.subscribe((event: SortEvent) => {
        this.sortColumn = event.sortColumn;
        this.sortDirection = event.sortDirection;
        this.getReport();
      });
    }

  ngOnInit() {
    this.onSelect(this.reports[0]);
  }

  toggleDropdown():void {
    this.dropdownStatus.isopen = !this.dropdownStatus.isopen;
  }

  onSelect(option: any) {
    this.selectedReport = option;
    this.selectedReportTitle = option.title;
    this.reportHeaders = option.headers;
    this.p = 1;
    this.getReport();
    this.reportData = [];
  }

  setOffset(page: number) {
    return ((page - 1) * this.limit).toString();
  }

  getReport(page: number = this.p) {
    let args: ReportParameters = {
      accountId: this.accountId,
      campaignId: this.campaignId,
      page: page,
      offset: this.setOffset(page),
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      limit: this.limit
    };

    if(this.selectedReport.name === 'url') {
      this.getURLReport(args);
    } else if (this.selectedReport.name === 'company') {
      this.getCompanyReport(args);
    }
  }

  getURLReport(args: ReportParameters) {
    this.reportData = [];
    this.urlReportService.load(args)
    .subscribe(urlReports => {
      this.total = urlReports.total;
      this.reportData = urlReports.data;
      this.p = args.page;
    });
  }

  getCompanyReport(args: ReportParameters) {
    this.reportData = [];
    this.companyReportService.load(args)
    .subscribe(companyReports => {
      this.total = companyReports.total;
      this.reportData = companyReports.data;
      this.p = args.page;
    });
  }
}
