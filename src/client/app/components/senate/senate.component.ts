import { Component, Input, OnInit }   from '@angular/core';
import { ActivatedRoute, Router }     from '@angular/router';
import { Observable }                 from 'rxjs/Observable';
import { MD_CARD_DIRECTIVES }         from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES }       from '@angular2-material/button';

import { Account }                    from '../../models/account';
import { AccountService }             from '../../services/account.service';
import { Module }                     from '../../models/module';
import { ModuleService }              from '../../services/module.service';


@Component({
  selector: 'module-list',
  directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES],
  providers: [AccountService, ModuleService],
  templateUrl: 'app/components/senate/senate.html',
  styleUrls: ['app/components/senate/senate.css']
})

export class SenateComponent implements OnInit {

  @Input() accountId: string;
  @Input() account$: Observable<Account>;
  @Input() modules$: Observable<Module[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private moduleService: ModuleService) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.accountId = params['id'];
      this.getAccount(this.accountId);
      this.getModules(this.accountId);
    });

  }

  getModules(accountId: any) {
    this.modules$ = this.moduleService.getModules(accountId);
  }

  /**
   *
   * @todo Refactor this into a barrel shared by all components
   */
  getAccount(accountId: any) {
    this.account$ = this.accountService.find$(accountId);
  }

}
