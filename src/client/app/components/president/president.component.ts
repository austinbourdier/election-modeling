import { Component, OnInit }        from '@angular/core';
import { ROUTER_DIRECTIVES,
         Router,
         ActivatedRoute }           from '@angular/router';
import { PaginatePipe,
         PaginationControlsCmp,
         PaginationService
       }                            from 'ng2-pagination';

import { CampaignPayload }          from '../../models/campaign-payload';
import { CampaignService }          from '../../services/campaign.service';
import { SearchBoxComponent }       from '../search/search-box.component';
import { SearchPipe }               from '../../pipes/search.pipe';



@Component({
  selector: 'president',
  pipes: [SearchPipe, PaginatePipe],
  providers: [CampaignService, PaginationService],
  directives: [ROUTER_DIRECTIVES, SearchBoxComponent, PaginationControlsCmp],
  templateUrl: 'app/components/president/president.html',
  styleUrls: ['app/components/president/president.css']
})

export class PresidentComponent implements OnInit {
  p: number = 1;
  limit: number = 20;
  term: string = '';
  campaigns: CampaignPayload;
  accountId: string;
  activeOnly: boolean = false;
  total: number = -1;
  hasCampaigns: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService) {}

  ngOnInit() {

  }

  setCampaignTotal(total: number) {
    this.total = total;
    this.hasCampaigns = this.total !== 0 ? true : false;
  }

  onActiveFlagChange() {
    this.activeOnly = !this.activeOnly;
    this.getCampaigns();
  }

  getCampaigns(page: number = 1) {
    this.campaignService.getCampaigns(this.accountId,
                                      ((page - 1) * this.limit).toString(),
                                      this.term, this.activeOnly.toString(),
                                      this.limit.toString())
      .subscribe(campaigns => {
        this.campaigns = campaigns;
        this.setCampaignTotal(this.campaigns.total);
        this.p = page;
      });
  }

  searchCampaigns() {
    this.getCampaigns();
  }

}
