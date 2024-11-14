import React from 'react';
import { ImportProductType, ImportProductTypesVietnamese } from '@/modules/imports/products/interface';


const typesColors: Record<ImportProductType, string> = {
    [ImportProductType.NORMAL]: 'text-cyan-700 bg-cyan-100',
    [ImportProductType.RETURN]: 'text-indigo-700 bg-indigo-100',
    [ImportProductType.OTHER]: 'text-slate-700 bg-slate-100',
};

type ImportProductTypesBadgeProps = {
    type: ImportProductType;
};


const ImportProductTypesBadge = ({ type }: ImportProductTypesBadgeProps) => {
    const colorClass = typesColors[type] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
    {ImportProductTypesVietnamese[type] || type}
    </span>
    );
};

export default ImportProductTypesBadge;

