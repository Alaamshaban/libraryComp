import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
export class CustomeTimeValidators {
  static fromToTime(
    fromTimeField: string,
    toTimeField: string,
    fromDateField: string,
    toDateField: string,
    errorName: string = 'fromToTime'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromTime = formGroup.get(fromTimeField).value;
      const toTime = formGroup.get(toTimeField).value;
      const fromDate = formGroup.get(fromDateField).value;
      const toDate = formGroup.get(toDateField).value;
      // Ausing the fromDate and toDate are numbers. In not convert them first after null check
      if (moment(fromDate).isSame(moment(toDate))) {
        if ((fromTime !== null && toTime !== null) &&
          Date.parse(`01/01/2011 ${toTime}`) < Date.parse(`01/01/2011 ${fromTime}`)) {
          return { [errorName]: true };
        }
      }
      return null;
    };
  }
}
