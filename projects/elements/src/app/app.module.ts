import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import {  ComponentsComponent } from '../../lib/components.component';
import { ComponentsModule } from '../../lib/components.module';
import { NtmpLogsComponent } from '../../lib/logs/ntmp-logs.component';
import { LogsModule } from '../../lib/logs/ntmp-logs.module';

@NgModule({
  imports: [
    BrowserModule,
    ComponentsModule,
    LogsModule
  ],
  providers: []
})
export class AppModule {

  constructor(private injector: Injector) { }

  // tslint:disable-next-line: typedef
  ngDoBootstrap() {
    const element = createCustomElement(ComponentsComponent, { injector: this.injector });
    customElements.define('lib-components', element);
    const element2 = createCustomElement(NtmpLogsComponent, { injector: this.injector });
    customElements.define('logs-component', element2);
  }

}
