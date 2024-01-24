import { DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
// import { Product, ProductDetails, VendorPieDataModel, vendorStats } from 'src/app/models/model';
// import { Service } from 'src/app/services/service';
import { dashboardService } from '../dashboard.service';
import { VendorStats } from '../Models';
import { DxChartComponent, DxPivotGridComponent } from 'devextreme-angular';
import { Statistics } from '../Statistics';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

@Component({
  selector: 'app-statistics-report',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit, AfterViewInit {
  // products: ProductDetails[] = [];
  vendorStats: VendorStats[] | undefined = [];
  formattedData: any;
  // cardDetails: vendorStats[] = [];
  // productNames: Product[] = [];
  vendorGroupedData: any[] = [];
  // statusesByProductType?: VendorPieDataModel[];
  statusTypes: string[] = [];
  treeBoxValue: any;
  // vendorDropdownDataSource: vendorStats[] = [];
  // selectedVendor?: vendorStats;
  // selectedProduct: Product;

  // dateRangeJson;
  startDate!: Date | string | number;
  endDate!: Date | string | number;
  currentDate: Date = new Date();


transformeddata:any;

@ViewChild(DxPivotGridComponent, { static: false }) pivotGrid?: DxPivotGridComponent;
pivotGridDataSource: any;
  @ViewChild(DxChartComponent, { static: false }) chart?: DxChartComponent;

  constructor(private service: dashboardService, private datepipe : DatePipe) {
 
    this.setLogDateToYesterday();
    // this.dateRangeJson ={
    //   "startdate": this.setMinDate(), //this.startDate ,// new Date(DateTime.Now.Year, DateTime.Now.Month, 1),
    //   "enddate" : this.endDate
    //  };  
    //  this.service.getVendorStatByDateRange(this.dateRangeJson).subscribe((apiresponse : any)=>{
    //   this.transformeddata = this.transformedData(apiresponse);
    //   this.vendorStats = apiresponse;

    //  })

    let d = Statistics.body;
    this.pivotGridDataSource = {
      store: JSON.parse(d!),
      fields: [
        // {
        //   caption: 'vendorName',
        //   width: 120,
        //   dataField: 'vendorName',
        //   area: 'row',
        //   sortBySummaryField: 'count'
        // },
        { area: "row", dataField: "vendorName", dataType: "string", caption: "X" },
        { area: "column", dataField: "msgdate", caption: "Y" },
        { area: "data", summaryType: "sum", dataField: "count", caption: "Count" }
      ]
    };
  }

  ngOnInit(): void {
    this.pivotGrid?.instance.getDataSource()
  }

  ngAfterViewInit(): void {
    this.pivotGrid?.instance.bindChart(this.chart?.instance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });

    setTimeout(() => {
      const dataSource = this.pivotGrid?.instance.getDataSource();
      dataSource?.expandHeaderItem('row', ['North America']);
      dataSource?.expandHeaderItem('column', [2013]);
    }, 0);
  }

  // setMinDate(){
  //   let sDate;
  //   sDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),1);
  //    return this.startDate =  this.datepipe.transform(sDate, 'yyyy-MM-dd');
  // }

    transformedData(apiresponse : any) {
      //return;'
      if(apiresponse  && apiresponse.body && Array.isArray(apiresponse.body)){
        return apiresponse.body.map((item: any)=>({
       
          // productType: item.productType,
          // vendorName : item.VendorName,
          // count : item.count,
          // msgDate : item.msgDate
      }))
      }
      else{
        console.log('Invalid or missing data in api response')
        return [];
      }
   
  }
  onDateChanged(e : any){
    const startdate = this.datepipe.transform(e.value, 'yyyy-MM-dd');
    const enddate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
   
    // this.dateRangeJson ={
    //   "startdate": startdate,
    //   "enddate" : enddate
    //  };
    //  this.getvendorStatData(this.dateRangeJson);
    //  this.service.getVendorStatByDateRange(this.dateRangeJson)
    //   .pipe(map((response: any) => response && response.statusCode && response.statusCode === 200 && response.body ? this.parseJson<vendorStats>(response.body) : []))
    //   .subscribe((res: vendorStats[]) => {
    //     this.vendorStats = res;
    //    this.getvendorStatData(res);
    //     console.log('vendorstats', this.vendorStats);      
    //   })

    // this.service.getVendorStatByDateRange(this.dateRangeJson).subscribe((apiresponse : any)=>{
    //   this.transformeddata = this.transformedData(apiresponse);

    //  })
    }

    getvendorStatData(res : any){
    //   this.service.getVendorStatByDateRange(res)
    //   .pipe(map((response: any) => response && response.statusCode && response.statusCode === 200 && response.body ? this.parseJson<vendorStats>(response.body) : []))
    //   .subscribe((result: vendorStats[]) => {

    //  })
    }

  private getUniqueByKey<T>(arr: any, key: string): T[] {
    return [...new Map(arr.map((item: any) => [item[key], item])).values()] as T[];
  }
  private parseJson<T>(data: any): T[] {
    return JSON.parse(data);
  }
  private setLogDateToYesterday(){
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate());
    return this.endDate = this.datepipe.transform(yesterday,'yyyy-MM-dd') || '';
  }
  disabledDates(e: any) {
    let now = new Date();
    return e.date > now;
  }

  customizeTooltip(args: any) {
    return {
      html: `${args.seriesName} | Total<div class='currency'>${args.valueText}</div>`,
    };
  }
}
