export class ProductDetails {
    productType: string | undefined;
    productId: number | undefined;
    vendorName: string | undefined;
    instanceId: number | undefined;
    instanceName: string | undefined;
}

//Product ID data not getting populated. It needs to be checked.
export class vendorStats {
    vendorId: number | undefined;
    productType: string | undefined;
    productId: number | undefined;
    vendorName: string | undefined;
    instanceName: string | undefined;
    status: string | undefined;
    msgdate: string | undefined;
}

export class Product {
    productType: string | undefined;
    productId: number | undefined;
}

export class Vendor {
    vendorId: number | undefined;
    vendorName: string | undefined;
}

export class Result<T> {
    body?: string;
    statusCode?: number;
}

export class VendorPieDataModel {
    msgDate?: string;
    statuses?: [];
}