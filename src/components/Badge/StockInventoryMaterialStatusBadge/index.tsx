import React from 'react';
import { StockInventoryMaterialStatus } from '@/modules/stock-inventorys/materials/interface';

const statusColors = {
    [StockInventoryMaterialStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [StockInventoryMaterialStatus.INACTIVE]: 'text-red-600 bg-red-200',

};


const StockInventoryMaterialStatusBadge = ({ status }: { status: StockInventoryMaterialStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50`}>
            {status === StockInventoryMaterialStatus.ACTIVE && 'Đang hoạt động'}
            {status === StockInventoryMaterialStatus.INACTIVE && 'Không hoạt động'}
        </span>
    );
};

export default StockInventoryMaterialStatusBadge;