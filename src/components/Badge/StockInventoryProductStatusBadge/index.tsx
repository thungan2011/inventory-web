import React from 'react';
import { StockInventoryProductStatus } from '@/modules/stock-inventorys/products/interface';

const statusColors = {
    [StockInventoryProductStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [StockInventoryProductStatus.INACTIVE]: 'text-red-600 bg-red-200',

};


const StockInventoryProductStatusBadge = ({ status }: { status: StockInventoryProductStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50`}>
            {status === StockInventoryProductStatus.ACTIVE && 'Đang hoạt động'}
            {status === StockInventoryProductStatus.INACTIVE && 'Không hoạt động'}
        </span>
    );
};

export default StockInventoryProductStatusBadge;