import { Component, Input, OnInit }      from '@angular/core';
import { DataTableDirective, SortEvent } from './datatable.directive';

@Component({
    selector: 'sorter',
    template: `
        <a style='cursor: pointer' (click)='sort()'>
            <ng-content></ng-content>
            <span *ngIf='isSortedAsc' aria-hidden='true'><i class='material-icons'>arrow_drop_up</i></span>
            <span *ngIf='isSortedDesc' aria-hidden='true'><i class='material-icons'>arrow_drop_down</i></span>
        </a>`
})
export class ColumnSorterComponent implements OnInit {
    @Input() datatable: DataTableDirective;
    @Input() sortColumn: string;

    private isSortedAsc: boolean = false;
    private isSortedDesc: boolean = false;

    ngOnInit() {
      this.datatable.onSortChange.subscribe((event:SortEvent) => {
          this.isSortedAsc = (event.sortColumn === this.sortColumn && event.sortDirection === 'asc');
          this.isSortedDesc = (event.sortColumn === this.sortColumn && event.sortDirection === 'desc');
      });
    }

    sort() {
        if(this.isSortedDesc) {
            this.datatable.setSort(this.sortColumn, 'asc');
        } else {
            this.datatable.setSort(this.sortColumn, 'desc');
        }
    }
}
