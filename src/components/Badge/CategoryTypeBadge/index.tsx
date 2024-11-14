import React from 'react';
import { CategoryType } from '@/modules/categories/interface';

const typeColors = {
    [CategoryType.PRODUCT]: 'text-cyan-700 bg-cyan-100',
    [CategoryType.MATERIAL]: 'text-indigo-700 bg-indigo-100',
    [CategoryType.PACKING]: 'text-slate-700 bg-slate-100',
};


const CategoryTypeBadge = ({ type }: { type: CategoryType }) => {
    const colorClass = typeColors[type] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {type === CategoryType.PRODUCT && 'Sản phẩm'}
            {type === CategoryType.MATERIAL && 'Nguyên vật liệu'}
            {type === CategoryType.PACKING && 'Bao bì/Đóng gói'}
        </span>
    );
};

export default CategoryTypeBadge;