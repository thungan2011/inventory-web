import React from 'react';
import { ProductPriceStatus } from '@/modules/product-price/interface';

const statusColors = {
    [ProductPriceStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [ProductPriceStatus.ACTIVE]: 'text-green-500 bg-green-100',

};
export const ProductPriceStatusVietnamese: Record<ProductPriceStatus, string> = {
    [ProductPriceStatus.ACTIVE]: 'Đang áp dụng',
    [ProductPriceStatus.INACTIVE]: 'Ngưng áp dụng',
};


const ProductPriceStatusBadge = ({ status }: { status: ProductPriceStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === ProductPriceStatus.INACTIVE && 'Ngưng áp dụng'}
            {status === ProductPriceStatus.ACTIVE && 'Đang áp dụng'}
        </span>
    );
};

export default ProductPriceStatusBadge;