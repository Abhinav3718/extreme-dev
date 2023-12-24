import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Product, ProductDetails, Result, vendorStats } from './Models';
import { dashboardService } from './dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class AppComponent implements OnInit {
  products: ProductDetails[] = [];
  vendorStats: vendorStats[] = [];
  formattedData: any;
  cardDetails: vendorStats[] = [];
  productNames: Product[] = [];
  vendorGroupedData: any[] = [];
  statusesByProductType?: { producType: any, statuses: any[] }[];
  statusTypes: string[] = [];

  constructor(private service: dashboardService) {
    this.setupStatusTypes();
    this.getProdHirerachy();
    this.getvendorstats();
  }

  ngOnInit(): void {

  }

  setupStatusTypes() {
    this.statusTypes = this.service.getStatusTypes();
  }

  getProdHirerachy() {
    this.service.getProductDetails() //.pipe(map((response: Result) => JSON.parse(response.body.toString())))
      .subscribe((productDetails: ProductDetails[]) => {
        this.products = productDetails;
        let groupedData = this.groupBy(productDetails, 'productType');

        if (groupedData) {
          let keys: string[] = Object.keys(groupedData);
          let productArray: any[] = [];
          keys.forEach((key: any) => {
            let id = groupedData[key][0].productId;
            productArray.push({ productId: id, productType: key });
            this.productNames = productArray;
          })
        }

      });

  }

  private groupBy(arr: any[], key: string): any[] {
    return arr.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {})
  };

  getvendorstats() {
    this.service.getvendorStatsDetails() //.pipe(map((response: any) => JSON.parse(response.body.toString())))
      .subscribe((res: any) => {
        this.vendorStats = res;
        this.cardDetails = res;
        console.log('vendorstats', this.vendorStats);

        this.buildTableData();
      })

  }

  onClick(e: any) {
    let selectedProduct: Product = <Product>e.addedItems[0];
    // console.log(selectedProduct);

    this.cardDetails = this.vendorStats.filter(r => r.productId === selectedProduct.productId);
    this.buildTableData(selectedProduct);
  }


  buildTableData(selectedProduct?: Product) {
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

  getStatusCount(arr: any[], value: any) {
    return arr.filter((element) => (element.status === value)).length;
  }

}