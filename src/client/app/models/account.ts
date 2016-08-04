export class Account {
  id: string;
  account_type: string;
  name: string;
  active: boolean;
  parent_id: number;
  salesforce_account_id:string; //TODO: this should be "crm_id"
}
