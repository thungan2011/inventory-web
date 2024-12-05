import React from 'react';
import { ProductActionType, ProductActionTypeVietnamese } from '@/modules/product-histories/inteface';


const typesColors: Record<ProductActionType, string> = {
    [ProductActionType.EXPORT_NORMAL]: 'text-blue-700 bg-blue-100',
    [ProductActionType.EXPORT_CANCEL]: 'text-red-700 bg-red-100',
    [ProductActionType.IMPORT_NORMAL]: 'text-green-700 bg-green-100',
    [ProductActionType.IMPORT_RETURN]: 'text-orange-700 bg-orange-100',
};

type ProductActionTypeBadgeProps = {
    type: ProductActionType;
};


const ProductActionTypeBadge = ({ type }: ProductActionTypeBadgeProps) => {
    const colorClass = typesColors[type] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
        {ProductActionTypeVietnamese[type] || type}
    </span>
    );
};

export default ProductActionTypeBadge;

