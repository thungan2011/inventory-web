import React from 'react';
import { StockMaterialStatus } from '@/modules/stock/materials/interface';

const statusColors = {
    [StockMaterialStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [StockMaterialStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [StockMaterialStatus.OUT_OF_STOCK]: 'text-sky-600 bg-sky-200',
};


const StockMaterialStatusBadge = ({ status }: { status: StockMaterialStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50`}>
            {status === StockMaterialStatus.ACTIVE && 'Đang hoạt động'}
            {status === StockMaterialStatus.INACTIVE && 'Không hoạt động'}
            {status === StockMaterialStatus.OUT_OF_STOCK && 'Tạm hết'}
        </span>
    );
};

export default StockMaterialStatusBadge;