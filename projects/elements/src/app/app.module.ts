import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ComponentsModule, ComponentsComponent } from 'components';

@NgModule({
  imports: [
    BrowserModule,
    ComponentsModule
  ],
  providers: []
})
export class AppModule {

  constructor(private injector: Injector) { }

  // tslint:disable-next-line: typedef
  ngDoBootstrap() {
    const element = createCustomElement(ComponentsComponent, { injector: this.injector });
    customElements.define('lib-components', element);
  }

}
