import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { NtmpLogsComponent } from '../../lib/logs/ntmp-logs.component';
import { LogsModule } from '../../lib/logs/ntmp-logs.module';

@NgModule({
  imports: [
    BrowserModule,
    LogsModule
  ],
  providers: []
})
export class AppModule {

  constructor(private injector: Injector) { }

  // tslint:disable-next-line: typedef
  ngDoBootstrap() {
    const element = createCustomElement(NtmpLogsComponent, { injector: this.injector });
    customElements.define('logs-component', element);
  }

}
