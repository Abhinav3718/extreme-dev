import { Pipe, PipeTransform } from "@angular/core";

import { dashboardService } from "./dashboard.service";

@Pipe({
    name: 'statuscount'
})

export class StatusCountPipeTransform implements PipeTransform {
    constructor(private service: dashboardService) { }

    transform(item: any, arg: number) {
        let statuses = this.service.getStatusTypes();
        let total = 0;
        if (arg > 0) {
            let status = statuses[arg - 1];
            total = item?.statuses?.find((r: any) => r.name === status).total;
        }
        return total;
    }
}