import React from 'react';
import { ProductStatus } from '@/modules/products/interface';

const statusColors = {
    [ProductStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [ProductStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [ProductStatus.OUT_OF_STOCK]: 'text-yellow-500 bg-yellow-100',

};
export const ProductStatusVietnamese : Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: 'Đang bán',
    [ProductStatus.INACTIVE]: 'Ngừng bán',
    [ProductStatus.OUT_OF_STOCK]: 'Hết hàng',
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === ProductStatus.INACTIVE && 'Ngừng bán'}
            {status === ProductStatus.ACTIVE && 'Đang bán'}
            {status === ProductStatus.OUT_OF_STOCK && 'Hết hàng'}
        </span>
    );
};

export default ProductStatusBadge;