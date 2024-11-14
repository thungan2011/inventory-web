export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED  = 'RETURNED',
    DRAFT = 'DRAFT'
}

export interface OrderOverview {
    id: string;
    code: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    status: OrderStatus;
    orderDate: Date;
    deliveryDate: Date;
    totalPrice: number;
    customer: {
        name: string;
    }
}