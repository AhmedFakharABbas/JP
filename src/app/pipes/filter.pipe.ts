import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {

    transform(value: any, filterValue: any, propName: string) {
        if (value == undefined || ((filterValue == undefined || filterValue == '') && filterValue != 0) || (value != undefined && value.length == 0)) {
            return value;
        }
        return value.filter(item => item[propName] == filterValue);
    }

}
