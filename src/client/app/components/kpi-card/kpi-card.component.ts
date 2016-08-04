import { Component,
         Input,
         OnInit }                       from '@angular/core';

import {MD_PROGRESS_CIRCLE_DIRECTIVES}  from '@angular2-material/progress-circle';
import {MD_CARD_DIRECTIVES}             from '@angular2-material/card';

import { KPIService }                   from '../../services/kpi.service';

@Component({
  selector: 'kpi-card',
  templateUrl: 'app/components/kpi-card/kpi-card.html',
  styleUrls: ['app/components/kpi-card/kpi-card.css'],
  providers: [KPIService],
  directives: [MD_CARD_DIRECTIVES, MD_PROGRESS_CIRCLE_DIRECTIVES],
})


export class KPICardComponent implements OnInit {
  @Input() accountId: string;
  @Input() campaignId: string;

  liftPercentage: string;



  constructor(public kpiService: KPIService) {}

  ngOnInit() {
    this.getKPIs();
  }

  getKPIs() {
    this.kpiService.load(this.accountId, this.campaignId)
    .subscribe(kpis => {
      this.liftPercentage = kpis.lift_percentage;
    });
  }
}
