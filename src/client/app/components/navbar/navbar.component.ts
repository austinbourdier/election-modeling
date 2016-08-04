import 'rxjs/add/operator/map';
import { Component, ViewEncapsulation, OnInit, ViewChild }   from '@angular/core';
import { Location, CORE_DIRECTIVES }                         from '@angular/common';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute }         from '@angular/router';
import { MdIcon, MdIconRegistry }                            from '@angular2-material/icon';
import { DROPDOWN_DIRECTIVES }                               from 'ng2-bootstrap/ng2-bootstrap';
import { MODAL_DIRECTVES, BS_VIEW_PROVIDERS}                 from 'ng2-bootstrap/ng2-bootstrap';

import { Account }                                           from '../../models/account';
import { AccountService }                                    from '../../services/account.service';
import { AccountsModalComponent }                            from '../../components/accounts-modal/accounts-modal.component';
import { MDLDirective }                                      from '../../directives/mdl.directive';
import { Module }                                            from '../../models/module';
import { ModuleService }                                     from '../../services/module.service';
import { NavItem }                                           from '../../models/nav-item';
import { UserService }                                       from '../../services/user.service';

@Component({
    selector: 'navbar',
    templateUrl: 'app/components/navbar/navbar.html',
    styleUrls: ['app/components/navbar/navbar.css'],
    directives: [AccountsModalComponent, CORE_DIRECTIVES, MdIcon,
                 MDLDirective, MODAL_DIRECTVES, DROPDOWN_DIRECTIVES, ROUTER_DIRECTIVES],
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None,
    providers: [UserService, MdIconRegistry, AccountService, ModuleService]
})



export class NavbarComponent implements OnInit {

  modalIsOpen: boolean = false;
  account: any;
  accountName: string;
  accountId: string = '';
  currentUser: any;
  parentAccountId: number;
  modulePermissions: any = {};
  navItems: NavItem[] = [
    {name: 'President', path: `model/president`, slug: 'president', active: false},
    {name: 'Senate', path: `model/senate`, slug: 'senate', active: false}
  ];
  @ViewChild('childModal') public childModal: any;


  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private moduleService: ModuleService) {}

  ngOnInit() {

  }


  isActive(selectedTab: NavItem) {
    this.navItems.forEach((item: NavItem) => {
      item.active = item === selectedTab ? true : false;
    });
  }

  public showChildModal():void {
    this.childModal.show();
  }

  public hideChildModal():void {
    this.childModal.hide();
  }

}
