import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Products } from "./Products";
import { Statistics } from "./Statistics";
import { VendorStatus } from "./VendorStatus";

@Injectable({
    providedIn: 'root'
})
export class dashboardService {
    private statusTypes: string[] = [];
    getProductDetails(): Observable<any> {
        return of(Products);
    }

    getvendorStatsDetails(logDate: Date): Observable<any> {
        return of(Statistics);
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