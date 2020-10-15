import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LogBodyComponent } from './logbody.component';
import * as moment from 'moment-timezone';
import { Logsfilter } from '../logs/models/logs-filter.model';
import { CustomeDateValidators } from '../logs/validators/from-to-date.validator';
import { CustomeTimeValidators } from '../logs/validators/form-to-time.validator';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LogRecord } from './models/log-record.model';

export const MY_FORMATS = {
  parse: { dateInput: 'DD-MM-YYYY' },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'logs-component',
  templateUrl: './ntmp-logs.component.html',
  styleUrls: ['./ntmp-logs.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class NtmpLogsComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  formSubscription;
  displayedColumns = ['description', 'request', 'response', 'date', 'status'];
  channelName: string;
  LogsFormFilter: FormGroup;
  Description = new Array<string>();
  StatusCode = new Array<number>();
  todayDate = moment(new Date());
  filter: Logsfilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() instanceTimeZone;
  @Input() instanceDateTimeFormat;
  @Input() dataSource = new MatTableDataSource();
  @Input() isLoadingResults: boolean;
  @Input() resultsLength;
  @Input() page: { num: number, length: number };
  @Output() searchFilter = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.setForm();
    this.StatusCode = Array.from(Array(35).keys());
    this.StatusCode.push(100, 101, 200, 400, 500);
    this.Description = [
      'ExpensesEvent-NTMP', 'AvailabilityEvent-NTMP', 'AvailabilityEvent-Internal', 'ReservationEvent-NTMP', 'ReservationEvent-Internal'
    ];
    this.page = {
      num: 0,
      length: 20
    };
  }

  // tslint:disable-next-line: typedef
  ngOnChanges() {
    if (this.instanceDateTimeFormat) {
      MY_FORMATS.display.dateInput = this.instanceDateTimeFormat.date;
      MY_FORMATS.parse.dateInput = this.instanceDateTimeFormat.date;
      this.todayDate.format(this.instanceDateTimeFormat.date);
    }
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = `${(this.page.num * 20) + 1} - ${(this.page.num * 20) + this.page.length}`;
  }

  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(page => {
      if (this.filter) {
        // output (searchParams)
        this.searchFilter.emit({
          index: page.pageIndex,
          filter: this.filter
        });
      } else {
        // output(searchParams)
        this.searchFilter.emit({
          index: page.pageIndex,
        });
      }
    });
  }

  // tslint:disable-next-line: typedef
  ngAfterViewChecked() {
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
    this.searchFilter.emit({
      filter: this.filter
    });
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
      this.searchFilter.emit({
        index: 0,
        filter: this.filter
      });
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
