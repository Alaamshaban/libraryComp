import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({ name: 'momentDateTime' })
export class MomentFormatPipe implements PipeTransform {
  transform(value: string, format: {
    date: string,
    timeZone: string,
    timeFormat: string
  }): string {
    return moment(value).tz(format.timeZone).
      format(`${format.date} ${format.timeFormat !== null ? 'hh:mm:ss A' : 'HH:mm:ss'}`);
  }
}
