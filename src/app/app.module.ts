import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DxListModule, DxTileViewModule } from 'devextreme-angular';
import { StatusCountPipeTransform } from './StatusCount.pipe';
import { StatusPipeTransform } from './Status.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StatusPipeTransform,
    StatusCountPipeTransform
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxListModule,
    DxTileViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
