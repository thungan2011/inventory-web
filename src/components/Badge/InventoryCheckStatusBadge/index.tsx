import React from 'react';
import { InventoryCheckStatus, InventoryCheckStatusVietnamese } from '@/modules/inventory-checks/interface';

const statusColors: Record<InventoryCheckStatus, string> = {
    [InventoryCheckStatus.PENDING]: 'text-yellow-500 bg-yellow-100',
    [InventoryCheckStatus.APPROVED]: 'text-blue-600 bg-blue-100',
    [InventoryCheckStatus.COMPLETED]: 'text-green-600 bg-green-100',
};

type InventoryCheckStatusBadgeProps = {
    status: InventoryCheckStatus;
};


const InventoryCheckStatusBadge = ({ status }: InventoryCheckStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {InventoryCheckStatusVietnamese[status] || status}
        </span>
    );
};

export default InventoryCheckStatusBadge;

