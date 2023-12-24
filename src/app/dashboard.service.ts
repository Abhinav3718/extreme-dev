import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ProductDetails, vendorStats } from "./Models";
import { Products } from "./Products";
import { Statistics } from "./Statistics";

@Injectable({
    providedIn: 'root'
})
export class dashboardService {
    getProductDetails(): Observable<ProductDetails[]> {
        return of(<ProductDetails[]>JSON.parse(Products.body));
    }

    getvendorStatsDetails(): Observable<vendorStats[]> {
        return of(<vendorStats[]>JSON.parse(Statistics.body));
    }

}