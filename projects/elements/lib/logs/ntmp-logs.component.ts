import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LogBodyComponent } from './logbody.component';
import * as moment from 'moment-timezone';
import { Logsfilter } from '../logs/models/logs-filter.model';
import { NtmpLogsService } from '../logs/service/ntmp-logs.service';
import { CookieService } from 'ngx-cookie';
import { CustomeDateValidators } from '../logs/validators/from-to-date.validator';
import { CustomeTimeValidators } from '../logs/validators/form-to-time.validator';
import { Select } from '@ngxs/store';
import { AuthState, AuthStateModel } from '../logs/store/auth.state';
import { Observable } from 'rxjs';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export interface LogRecord {
  date: string;
  description: string;
  request: {
    type: string;
    payload: string;
  };
  response: {
    type: string;
    status_code: number;
    payload: string;
  };
}

export const MY_FORMATS = {
  parse: { dateInput: 'DD-MM-YYYY' },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'logs-component',
  templateUrl: './ntmp-logs.component.html',
  styleUrls: ['./ntmp-logs.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class NtmpLogsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  formSubscription;
  dataSource = new MatTableDataSource();
  displayedColumns = ['description', 'request', 'response', 'date', 'status'];
  resultsLength = 0;
  channelName: string;
  LogsFormFilter: FormGroup;
  filter: Logsfilter;
  Description = new Array<string>();
  StatusCode = new Array<number>();
  page: { num: number, length: number };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  instanceTimeZone;
  instanceDateTimeFormat;
  todayDate = moment(new Date());

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.setForm();
    this.page = {
      num: 0,
      length: 20
    };
    this.StatusCode = Array.from(Array(35).keys());
    this.StatusCode.push(100, 101, 200, 400, 500);
    // this.StatusCode  = Array(35).fill().map((x,i)=>i);
    this.Description = [
      'ExpensesEvent-NTMP', 'AvailabilityEvent-NTMP', 'AvailabilityEvent-Internal', 'ReservationEvent-NTMP', 'ReservationEvent-Internal'
    ];
    // this.paginator.page.subscribe(page => {
    //   if (this.filter) {
    //     // output (searchParams)
    //     //  this.load(page.pageIndex, this.filter);
    //   } else {
    //     // output(searchParams)
    //     // this.load(page.pageIndex);
    //   }
    // });
    // input instanceTimeZone
    // this.instanceTimeZone = this.cookieService.get('instance_tz');

    /**  instanceDateTimeFormat input 
     * dateFormat input
    */

    // this.instanceDateTimeFormat = {
    //   date: authState.dateFormat,
    //   timeZone: authState.timeZone,
    //   timeFormat: authState.timeFormat === 'am/pm' ? 'A' : null
    // };
    // MY_FORMATS.display.dateInput = authState.dateFormat;
    // MY_FORMATS.parse.dateInput = authState.dateFormat;
    // this.todayDate.format(authState.dateFormat);
  }

  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // tslint:disable-next-line: typedef
  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = `${(this.page.num * 20) + 1} - ${(this.page.num * 20) + this.page.length}`;
  }

  openDialog(data: any): void {
    this.dialog.open(LogBodyComponent, {
      width: '80vw',
      height: '100vh',
      data: JSON.parse(data)
    });
  }

  countSuccessfullLogs(): number {
    return this.dataSource.data.filter((v: LogRecord) => v.response && v.response.status_code === 200).length;
  }

  countFailedLogs(): number {
    return this.dataSource.data.filter((v: LogRecord) => v.response && v.response.status_code !== 200).length;
  }

  // tslint:disable-next-line: typedef
  refresh() {
    this.setForm();
    this.filter = {
      start_date: null,
      end_date: null,
      status: null,
      description: null
    };
    // output (refreshed)
    //  this.load();
  }

  // tslint:disable-next-line: typedef
  setForm() {
    this.LogsFormFilter = this.fb.group({
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      status: '',
      description: ''
    }, {
      validator: [
        CustomeDateValidators.fromToDate('start_date', 'end_date'),
        CustomeTimeValidators.fromToTime('start_time', 'end_time', 'start_date', 'end_date')
      ]
    });
    this.todayDate = moment(new Date());
  }

  // tslint:disable-next-line: typedef
  search(val) {
    this.resetFormFields();
    if (this.LogsFormFilter.valid) {
      const startDateTime = this.getDateTime(val.start_date ? val.start_date : '', val.start_time ? val.start_time : '');
      const endDateTime = this.getDateTime(val.end_date ? val.end_date : '', val.end_time ? val.end_time : '');
      this.filter = {
        start_date: startDateTime ? startDateTime : null,
        end_date: endDateTime ? endDateTime : null,
        status: (val.status || val.status === 0) ? val.status : null,
        description: val.description || null
      };
      // output(searchFileds)
      //  this.load(0, this.filter);
    } else {
      Object.keys(this.LogsFormFilter.errors).forEach(key => {
        if (key === 'fromToDate' && this.LogsFormFilter.errors[key]) {
          this.LogsFormFilter.get('start_date').markAsTouched();
          this.LogsFormFilter.get('start_date').setErrors({ [key]: true });
        }
        if (key === 'fromToTime' && this.LogsFormFilter.errors[key]) {
          this.LogsFormFilter.get('start_time').markAsTouched();
          this.LogsFormFilter.get('start_time').setErrors({ [key]: true });
        }
      });
    }
  }

  // tslint:disable-next-line: typedef
  resetFormFields() {
    this.LogsFormFilter.get('start_date').markAsUntouched();
    this.LogsFormFilter.get('start_date').setErrors(null);
    this.LogsFormFilter.get('start_time').markAsUntouched();
    this.LogsFormFilter.get('start_time').setErrors(null);
  }

  getDateTime(date, time: string): string {
    const currentDate = moment(new Date()).format();
    // remove double quotes from instanceTimeZone varibale comes from cookies
    this.instanceTimeZone = this.instanceTimeZone.replace(/^"(.*)"$/, '$1');
    let DateTime;
    if (time !== '' && moment(date).isValid()) {
      // both are valid
      const stringDateWithTime = `${moment(date).format('YYYY-MM-DD')} ${time}`;
      DateTime = moment.tz(stringDateWithTime, this.instanceTimeZone).format();
    } else if (time !== '' && !moment(date).isValid()) {
      // here time is valid
      const currentDateWithTime = `${moment(currentDate).format('YYYY-MM-DD')} ${time}`;
      this.LogsFormFilter.patchValue({
        start_date: moment(new Date()),
        end_date: moment(new Date())
      });
      DateTime = moment.tz(currentDateWithTime, this.instanceTimeZone).format();
    } else if (time === '' && moment(date).isValid()) {
      // date is valid
      const stringDate = `${moment(date).format('YYYY-MM-DD')} 00:00`;
      DateTime = moment.tz(stringDate, this.instanceTimeZone).format();
    } else {
      // both are invalid
      DateTime = null;
    }
    return DateTime;
  }
}
