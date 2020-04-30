import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    return moment(value).format(arg);
  }

}
