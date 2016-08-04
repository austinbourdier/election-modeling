import { Directive, Input, EventEmitter } from '@angular/core';

export interface SortEvent {
  sortColumn: string;
  sortDirection: string;
}

@Directive({
  selector: '[dataTable]'
})
export class DataTableDirective {
  @Input() tableData: any;
  public data: any[];
  public onSortChange = new EventEmitter<SortEvent>();

  private sortColumn = '';
  private sortDirection = 'desc';
  private mustRecalculateData = false;

  public getSort():SortEvent {
    return {sortColumn: this.sortColumn, sortDirection: this.sortDirection};
  }

  public setSort(sortColumn:string, sortDirection:string):void {
    if (this.sortColumn !== sortColumn || this.sortDirection !== sortDirection) {
      this.sortColumn = sortColumn;
      this.sortDirection = sortDirection;
      this.mustRecalculateData = true;
      this.onSortChange.emit({sortColumn: sortColumn, sortDirection: sortDirection});
    }
  }
}
