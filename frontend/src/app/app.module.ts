import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }) : [],
    environment.production ? ServiceWorkerModule.register('assets/custom-sw.js', { enabled: environment.production }) : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
