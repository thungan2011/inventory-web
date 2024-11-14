import React from 'react';
import { ExportMaterialType } from '@/modules/exports/materials/interface';
import { ExportProductType, ExportProductTypeVietnamese } from '@/modules/exports/products/interface';


const typesColors: Record<ExportProductType, string> = {
    [ExportProductType.NORMAL]: 'text-cyan-700 bg-cyan-100',
    [ExportProductType.CANCEL]: 'text-pink-700 bg-pink-100',
    [ExportMaterialType.OTHER]: 'text-slate-700 bg-slate-100',
};

type ExportProductTypeBadgeProps = {
    type: ExportProductType;
};


const ExportProductTypeBadge = ({ type }: ExportProductTypeBadgeProps) => {
    const colorClass = typesColors[type] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
    {ExportProductTypeVietnamese[type] || type}
    </span>
    );
};

export default ExportProductTypeBadge;

