import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DxChartModule, DxDateBoxModule, DxListModule, DxPivotGridModule, DxSelectBoxModule, DxTileViewModule } from 'devextreme-angular';
import { StatusCountPipeTransform } from './StatusCount.pipe';
import { StatusPipeTransform } from './Status.pipe';
import { DxPieChartModule } from 'devextreme-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { DatePipe, DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    StatusPipeTransform,
    StatusCountPipeTransform,
    DashboardComponent,
    Dashboard2Component,
    NewDashboardComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxListModule,
    DxTileViewModule,
    DxPieChartModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxPivotGridModule,
    DxChartModule 
  ],
  providers: [DatePipe,
    DecimalPipe],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
