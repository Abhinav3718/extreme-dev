import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ProductDetails, vendorStats } from "./Models";
import { Products } from "./Products";
import { Statistics } from "./Statistics";
import { VendorStatus } from "./VendorStatus";

@Injectable({
    providedIn: 'root'
})
export class dashboardService {
    private statusTypes: string[] = [];
    getProductDetails(): Observable<ProductDetails[]> {
        return of(<ProductDetails[]>JSON.parse(Products.body));
    }

    getvendorStatsDetails(): Observable<vendorStats[]> {
        return of(<vendorStats[]>JSON.parse(Statistics.body));
    }

    getStatusTypes(): string[] {
        this.statusTypes = [];
        for(let status in VendorStatus) {
          this.statusTypes.push(status);
        }
        this.statusTypes = this.statusTypes.sort();
        return this.statusTypes;
      }

}