import { NgModule } from '@angular/core';
import { NtmpLogsComponent } from './ntmp-logs.component';
import { LogBodyComponent } from './logbody.component';

import { EllipsisPipe } from '../logs/pipes/ellipsis.pipe';
import { PrettyXMLPipe } from '../logs/pipes/xml.pipe';
import { MomentFormatPipe } from '../logs/pipes/date-format.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatTableModule
} from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    NtmpLogsComponent,
    EllipsisPipe,
    PrettyXMLPipe,
    MomentFormatPipe,
    LogBodyComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
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
    MatProgressSpinnerModule,
    AmazingTimePickerModule,
    MatToolbarModule,
    MatToolbarModule,
    MatNativeDateModule,
    BrowserAnimationsModule
  ],
  entryComponents: [LogBodyComponent]
})
export class LogsModule {
}
