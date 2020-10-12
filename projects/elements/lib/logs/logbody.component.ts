import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    template: `
      <div mat-dialog-content>
        <div class="column">
          <button mat-button (click)="copy()" [style.max-width]="'200px'"><mat-icon>content_copy</mat-icon> Copy</button>
          <br >
          <textarea id="textarea" rows="100" style="
          margin-top: 10px;
          width: 100%;
          height: 100%">{{ data | json }}</textarea>
        </div>
      </div>
    `,
})
export class LogBodyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    const elm = document.getElementById('textarea') as HTMLTextAreaElement;
    elm.focus();
  }

  // tslint:disable-next-line: typedef
  copy() {
    const elm = document.getElementById('textarea') as HTMLTextAreaElement;
    elm.focus();
    elm.select();
    document.execCommand('copy');
    elm.blur();
  }

}
