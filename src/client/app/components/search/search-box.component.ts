import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'search-box',
  templateUrl: 'app/components/search/search-box.html',
  styleUrls: ['app/components/search/search-box.css']
})

export class SearchBoxComponent {
  @Output() update = new EventEmitter();
  //TODO: add input for placeholder text to reflect which field is being
  //searched for a given collection
  //@Input() searchField = 'Name'
}
