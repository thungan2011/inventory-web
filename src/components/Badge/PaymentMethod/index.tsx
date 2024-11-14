import React from 'react';
import { PaymentMethod } from '@/modules/orders/interface';

const statusColors = {
    [PaymentMethod.BANK_TRANSFER]: 'text-green-500 bg-green-100',
    [PaymentMethod.CASH]: 'text-yellow-500 bg-yellow-100',
};

export const PaymentMethodVietnamese: Record<PaymentMethod, string> = {
    [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
    [PaymentMethod.CASH]: 'Tiền mặt',
};

const PaymentMethodBadge = ({ status }: { status: PaymentMethod }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === PaymentMethod.BANK_TRANSFER && 'Chuyển khoản'}
            {status === PaymentMethod.CASH && 'Tiền mặt'}
        </span>
    );
};

export default PaymentMethodBadge;