import 'rxjs/Rx';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable }          from 'rxjs/Observable';

@Pipe({
	name: 'search'
})

export class SearchPipe implements PipeTransform {
  // Note: searchField could be made into an array here so we could actually
  // search for an input term across multiple values on an object
  transform(collection: Observable<any> = new Observable(),
            term: string = '',
            searchField = 'name') {

    if (!collection || !collection.filter) {
      // TODO: figure out how to prevent null from getting passed here from components
      return null;
    };

    return collection.filter(value => {
      return value[searchField].toLowerCase().indexOf(term.toLowerCase()) !== -1;
    });
  }
}
