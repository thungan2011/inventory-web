import React from 'react';
import { StockProductStatus } from '@/modules/stock/products/interface';

const statusColors = {
    [StockProductStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [StockProductStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [StockProductStatus.OUT_OF_STOCK]: 'text-sky-600 bg-sky-200',
};


const StockProductStatusBadge = ({ status }: { status: StockProductStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50`}>
            {status === StockProductStatus.ACTIVE && 'Đang hoạt động'}
            {status === StockProductStatus.INACTIVE && 'Không hoạt động'}
            {status === StockProductStatus.OUT_OF_STOCK && 'Tạm hết'}
        </span>
    );
};

export default StockProductStatusBadge;