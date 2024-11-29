export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    SHIPPING = 'SHIPPING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
    DRAFT = 'DRAFT'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
}

export enum PaymentMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    CASH = 'CASH',
}

export const PaymentMethodVietnamese: Record<PaymentMethod, string> = {
    [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
    [PaymentMethod.CASH]: 'Tiền mặt',
};

export enum DeliveryType {
    SHIPPING = 'SHIPPING',
    STORE_PICKUP = 'STORE_PICKUP',
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
    note: string;
    paymentStatus: PaymentStatus,
    paymentMethod: PaymentMethod,
    customer: {
        id: number;
        code: string;
        name: string;
        email: string;
        address: string;
        ward: string;
        city: string;
        district: string;
        phone: string;
    };
}

export interface OrderDetail extends OrderOverview {
    shippingFee: number;
    discountPercent: number;
    deliveryType: DeliveryType;
    orderDetails: {
        product: {
            id: number;
            sku: string;
            name: string;
            image: string;
            weight: number;
            unit: string;
            packing: string;
        };

        price: number;
        quantity: number;
    } [];
}