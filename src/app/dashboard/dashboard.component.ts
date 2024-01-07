import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Product, ProductDetails, Vendor, vendorStats } from '../Models';
import { dashboardService } from '../dashboard.service';
import { map } from 'rxjs';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {
  products: ProductDetails[] = [];
  vendorStats: vendorStats[] = [];
  formattedData: any;
  cardDetails: vendorStats[] = [];
  productNames: Product[] = [];
  vendorGroupedData: any[] = [];
  statusesByProductType?: { producType: any, statuses: any[] }[];
  statusTypes: string[] = [];

  logDate!: Date | string | number;

  treeBoxValue: any;
  dropdownDataSource: Vendor[] = [];

  selectedVendor?: vendorStats;
  selectedProduct: Product;

  // minDate?: Date;
  // maxDate?: Date;

  constructor(private service: dashboardService) {
    this.selectedProduct = {productId: 1, productType: 'Marketing Automation'};
    this.setLogDateToYesterday();
    this.setupStatusTypes();
    this.getProdHirerachy();
    this.getvendorstats();
  }

  ngOnInit(): void {

  }

  setupStatusTypes() {
    this.statusTypes = this.service.getStatusTypes();
  }

  // dataSource!: DataSource;



  getProdHirerachy() {
    this.service.getProductDetails()
      .pipe(map((response: any) => response && response.statusCode && response.statusCode === 200 && response.body ? this.parseJson<ProductDetails>(response.body) : []))
      .subscribe((productDetails: ProductDetails[]) => {
        
        let arr: any[] = productDetails.map(r => {
          return {productId: r.productId, productType: r.productType};
        });

        this.productNames = this.getUniqueByKey<Product>(arr, 'productId');

        let arr2: any[] = productDetails.filter((product: ProductDetails) => product.productId === this.selectedProduct.productId)
                                    .map((prod: ProductDetails) => {
                                                return {vendorId: prod.instanceId, vendorName: prod.vendorName};
                                              });

        this.dropdownDataSource = this.getUniqueByKey<Vendor>(arr2, 'vendorId');
      });

  }

  getvendorstats() {
    this.service.getvendorStatsDetails(this.logDate as Date)
      .pipe(map((response: any) => response && response.statusCode && response.statusCode === 200 && response.body ? this.parseJson<vendorStats>(response.body) : []))
      .subscribe((res: vendorStats[]) => {
        this.vendorStats = res;
        // this.cardDetails = res;
        // console.log('vendorstats', this.vendorStats);

        this.buildTableData();

        if(this.productNames && this.productNames.length > 0) {
          this.productNames.forEach((product: Product) => {
            let specificProductTypeData = this.vendorStats.filter((vendor: vendorStats) => vendor.productType === product.productType)
          })
        }

        

      })

  }

  onSelectProductTypeClick(e: any) {
    this.selectedProduct = e.addedItems[0];
    this.buildTableData(this.selectedProduct);
  }

  private getUniqueByKey<T>(arr: any, key: string): T[] {
    return [...new Map(arr.map((item: any) => [item[key], item])).values()] as T[];
  }

  private setLogDateToYesterday() {
    
    let now = new Date();
    this.logDate = now;
    this.logDate.setDate(this.logDate.getDate() - 1);
  }

  disabledDates(e: any) {
    let now = new Date();

    return e.date > now;

    
    // this.maxDate = new Date();
    // this.minDate = new Date(now.setDate(now.getDate() - 8));
    // if(e.date < this.maxDate! && e.date > this.minDate!)
    // return false;

    // if(e.date < now)
    // return false;

    // return true;
  }

  private groupBy(arr: any[], key: string): any[] {
    return arr.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {})
  };

  private setCardDetails() {
    // this condition needs to be changed based on productId, once this value is populated from API in VendorStats
    this.cardDetails = this.vendorStats.filter(r => r.productType === this.selectedProduct.productType);
  }


  private buildTableData(selectedProduct?: Product) {

    this.setCardDetails();

    let statusesByProductType = [];
    this.vendorGroupedData = this.groupBy(this.cardDetails, 'productType');

    let keys = Object.keys(this.vendorGroupedData).sort();

    if (selectedProduct && this.cardDetails.length === 0) {
      let obj = { producType: selectedProduct?.productType, statuses: [{}] };
      let statuses = [{}];
      for (let status of this.statusTypes) {
        statuses.push({
          name: status,
          total: 0
        })
      }
      statuses.shift();
      obj.statuses = statuses;
      statusesByProductType.push(obj);
    } else {
      keys.forEach((key: any) => {
        let obj = { producType: key, statuses: [{}] };
        let currentIterationVendorData = this.vendorGroupedData[key];

        for (let status of this.statusTypes) {
          obj.statuses.push({
            name: status,
            total: this.getStatusCount(currentIterationVendorData, status)
          })
        }

        obj.statuses.shift();
        statusesByProductType.push(obj);
      })
    }

    this.statusesByProductType = statusesByProductType; // Object.assign({}, statusesByProductType);

    console.log(this.statusesByProductType)

  }

  private getStatusCount(arr: any[], value: any) {
    return arr.filter((element) => (element.status === value)).length;
  }

  private parseJson<T>(data: any): T[] {
    return JSON.parse(data);
  }

  onVendorChanged(e: any) {
    console.log(this.selectedVendor);
  }

}