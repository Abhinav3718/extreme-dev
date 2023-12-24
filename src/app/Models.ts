export class ProductDetails {
    productType: string | undefined;
    productId: number | undefined;
    vendorName: string | undefined;
    instanceId: number | undefined;
    instanceName: string | undefined;
}

export class vendorStats {
    productType: string | undefined;
    productId: number | undefined;
    vendorName: string | undefined;
    instanceName: string | undefined;
    status: string | undefined;
}

export class Product {
    productType: string | undefined;
    productId: number | undefined;
}

export class Result {
    body?: Product[];
}