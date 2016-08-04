import {Component, Output, OnInit, EventEmitter} from '@angular/core';
import { AccountService }                            from '../../services/account.service';
import { Account }                            from '../../models/account';
import { MD_LIST_DIRECTIVES }           from '@angular2-material/list';

@Component({
  selector: 'accounts-modal',
  templateUrl: 'app/components/accounts-modal/accounts-modal.html',
  providers: [AccountService],
  directives: [ MD_LIST_DIRECTIVES ],
  styleUrls: ['app/components/accounts-modal/accounts-modal.css']
})

export class AccountsModalComponent implements  OnInit {
  @Output() accountUpdated = new EventEmitter();
  @Output() hideChildModal = new EventEmitter();
  accounts: Array<Object>;


  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    // this.getAccounts();
  }

  changeAccount (account: Account) {
    this.accountUpdated.emit(account);
    this.hideModal();
  }

  getAccounts() {

    this.accountService.getAccounts()
      .subscribe((res: any) => {
        this.accounts = res.data;
      });
  }

  hideModal() {
    this.hideChildModal.emit(true);
  }

}
