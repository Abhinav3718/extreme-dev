import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Product, ProductDetails, Vendor, VendorPieDataModel, vendorStats } from '../Models';
import { dashboardService } from '../dashboard.service';
import { map } from 'rxjs';

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
  statusesByProductType?: VendorPieDataModel[];
  statusTypes: string[] = [];

  logDate!: Date | string | number;

  treeBoxValue: any;
  vendorDropdownDataSource: vendorStats[] = [];

  selectedVendor?: vendorStats;
  selectedProduct: Product;

  constructor(private service: dashboardService) {
    this.selectedProduct = { productId: 1, productType: 'Marketing Automation' };
    this.setLogDateToYesterday();
    this.setupStatusTypes();
    this.getProdHirerachy();
    this.getvendorstats();
  }

  customizeTooltip = (arg: any) => ({
    text: arg.value != 0 ? `${arg.argument} (${arg.value})` : ''
  });

  ngOnInit(): void {

  }

  setupStatusTypes() {
    this.statusTypes = this.service.getStatusTypes();
  }

  getProdHirerachy() {
    this.service.getProductDetails()
      .pipe(map((response: any) => response && response.statusCode && response.statusCode === 200 && response.body ? this.parseJson<ProductDetails>(response.body) : []))
      .subscribe((productDetails: ProductDetails[]) => {
        this.products = productDetails;
        console.log(productDetails)

        let arr: any[] = productDetails.map(r => {
          return { productId: r.productId, productType: r.productType };
        });

        this.productNames = this.getUniqueByKey<Product>(arr, 'productId');

        this.setVendorDropdown();
        this.selectedVendor = Object.assign({}, this.vendorDropdownDataSource[0]);
      });

  }

  private setVendorDropdown() {
    let arr2: any[] = this.products.filter((product: ProductDetails) => product.productId === this.selectedProduct.productId)
          .map((prod: ProductDetails) => {
            return { vendorId: prod.instanceId, vendorName: prod.vendorName?.split(' - ')[1], instanceName: prod.vendorName };
          });

          this.vendorDropdownDataSource = [];

        this.vendorDropdownDataSource = this.getUniqueByKey<vendorStats>(arr2, 'vendorId');
        console.log(this.vendorDropdownDataSource);
        

        // this.selectedVendor = this.vendorDropdownDataSource[0];

  }

  getvendorstats() {
    this.service.getvendorStatsDetails(this.selectedProduct.productId, this.logDate as Date)
      .pipe(map((response: any) => response && response.statusCode && response.statusCode === 200 && response.body ? this.parseJson<vendorStats>(response.body) : []))
      .subscribe((res: vendorStats[]) => {
        this.vendorStats = res;
        console.log('vendorstats', this.vendorStats);

        this.selectedVendor = Object.assign({}, this.vendorDropdownDataSource[0]);

        this.buildPieChartData();
      })

  }

  onSelectProductTypeClick(e: any) {
    this.selectedProduct = e.addedItems[0];
    this.setVendorDropdown();
    this.buildPieChartData();
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

    if(this.selectedVendor && this.selectedVendor.vendorName) {
      this.cardDetails = this.cardDetails.filter(r => r.vendorName === this.selectedVendor?.vendorName);
    }
  }


  private buildPieChartData() {
    
    this.setCardDetails();

    let statusesByProductType: VendorPieDataModel[] = [{}];
    this.vendorGroupedData = this.groupBy(this.cardDetails, 'msgdate');

    let keys = Object.keys(this.vendorGroupedData).sort();
    let obj: VendorPieDataModel[] = [];

    if(keys && keys.length > 0) {
      keys.forEach((msgDate: any) => {
        let current = this.vendorGroupedData[msgDate];

        let statuses: any = [];
        this.statusTypes.forEach((status: string) => {
          statuses.push({
            name: status,
            total: this.getStatusCount(current, status)
          })
        });

        obj.push({
          msgDate: msgDate,
          statuses: statuses
        })
        
        statusesByProductType = obj;

      })
    }

    this.statusesByProductType = statusesByProductType;

    console.log(this.statusesByProductType)

  }

  pointClickHandler(e: any) {

  }

  legendClickHandler(e: any) {

  }

  private getStatusCount(arr: any[], value: any) {
    return arr.filter((element) => (element.status === value)).length;
  }

  private parseJson<T>(data: any): T[] {
    return JSON.parse(data);
  }

  onVendorChanged(e: any) {
    //console.log(this.selectedVendor);
    this.buildPieChartData();
  }

}