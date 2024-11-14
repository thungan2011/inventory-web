import React from 'react';
import { PaymentStatus } from '@/modules/orders/interface';

const statusColors = {
    [PaymentStatus.PENDING]: 'text-green-500 bg-green-100',
    [PaymentStatus.PAID]: 'text-yellow-500 bg-yellow-100',
};

export const PaymentStatusVietnamese: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Chờ thanh toán',
    [PaymentStatus.PAID]: 'Đã thanh toán',
};

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === PaymentStatus.PENDING && 'Chờ thanh toán'}
            {status === PaymentStatus.PAID && 'Đã thanh toán'}
        </span>
    );
};

export default PaymentStatusBadge;