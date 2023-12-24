import { Pipe, PipeTransform } from "@angular/core";
import { VendorStatus } from "./VendorStatus";

@Pipe({
    name: 'status'
})
export class StatusPipeTransform implements PipeTransform {
    transform(value: any) {
        let res = '';
        if(value === VendorStatus.error) {
            res = 'Error';
        }
        else if(value === VendorStatus.reconciled) {
            res = 'Reconciled';
        }
        else if(value === VendorStatus.remediated) {
            res = 'Remediated';
        }
        return res;
    }

}