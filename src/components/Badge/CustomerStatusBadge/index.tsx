import React from 'react';
import { CustomerStatus } from '@/modules/customers/interface';

const statusColors = {
    [CustomerStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [CustomerStatus.INACTIVE]: 'text-red-600 bg-red-200',

};
export const CustomerStatusVietnamese : Record<CustomerStatus, string> = {
    [CustomerStatus.ACTIVE]: 'Đang hoạt động',
    [CustomerStatus.INACTIVE]: 'Ngưng hoạt động',
};

const CustomerStatusBadge = ({ status }: { status: CustomerStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === CustomerStatus.ACTIVE && 'Đang hoạt động'}
            {status === CustomerStatus.INACTIVE && 'Ngưng hoạt động'}
        </span>
    );
};

export default CustomerStatusBadge;