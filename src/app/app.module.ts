import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DxDateBoxModule, DxListModule, DxSelectBoxModule, DxTileViewModule } from 'devextreme-angular';
import { StatusCountPipeTransform } from './StatusCount.pipe';
import { StatusPipeTransform } from './Status.pipe';
import { DxPieChartModule } from 'devextreme-angular';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusPipeTransform,
    StatusCountPipeTransform,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxListModule,
    DxTileViewModule,
    DxPieChartModule,
    DxSelectBoxModule,
    DxDateBoxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
