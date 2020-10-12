import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtmpLogsComponent } from './ntmp-logs.component';
import {
  MatSnackBar, MatFormFieldModule, MatInputModule, MatSnackBarModule
  , MatProgressBarModule, MatDatepicker, MatDatepickerModule, MatSelectModule,
  MatCardModule, MatButtonModule, MatAutocompleteModule, MatPaginatorModule, MatTableModule, MatIconModule,
  MatProgressSpinnerModule, MatToolbarModule, MatNativeDateModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { TranslateModule } from '@ngx-translate/core';
import { EllipsisPipe } from 'src/app/pipes/ellipsis.pipe';
import { PrettyXMLPipe } from 'src/app/pipes/xml.pipe';
import { LogBodyComponent } from './logbody.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import * as moment from 'moment';

xdescribe('NtmpLogsComponent', () => {
  let component: NtmpLogsComponent;
  let fixture: ComponentFixture<NtmpLogsComponent>;
  let snackBar: MatSnackBar;
  let datePicker: MatDatepicker<any>;
  let mockFilterDetails;
  let mockSearchDetails;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NtmpLogsComponent, EllipsisPipe,
        PrettyXMLPipe,
        LogBodyComponent],
      imports: [
        CommonModule,
        NgxsModule.forRoot([]),
        FlexLayoutModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatTableModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        AmazingTimePickerModule,
        TranslateModule,
        MatToolbarModule,
        MatNativeDateModule,
        HttpClientModule,
      ],
      providers: [MatDatepicker, ViewContainerRef]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtmpLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    snackBar = TestBed.get(MatSnackBar);
    datePicker = TestBed.get(MatDatepicker);
    mockFilterDetails = {
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      status: '',
      description: ''
    };
    mockSearchDetails = {
      description: null,
      end_date: '2020-09-05T00:09:00+02:00',
      start_date: '2020-09-04T00:09:00+02:00',
      status: null
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should make expected calls', () => {
    const spy1 = spyOn(component, 'setForm');
    const spy2 = spyOn(component, 'load');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('setForm should build the form', () => {
    component.setForm();
    expect(component.LogsFormFilter.value).toEqual(mockFilterDetails);
  });

  describe('search', () => {
    it('search with search form', () => {
      component.search(mockSearchDetails);
      expect(component.filter).toEqual(mockSearchDetails);
    });
  });

  describe('getDateTime', () => {
    it('chnage date time formate', () => {
      const date = 'Fri Sep 04 2020 00:00:00 GMT+0200 (Eastern European Standard Time)';
      const time = '2:00';
      const dateTime = component.getDateTime(moment(date), time);
      expect(dateTime).toEqual('2020-09-04T02:11:00+02:00');
    });
  });
});
