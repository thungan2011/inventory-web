import React from 'react';
import { ExportMaterialType, ExportMaterialTypeVietnamese } from '@/modules/exports/materials/interface';


const typesColors: Record<ExportMaterialType, string> = {
    [ExportMaterialType.NORMAL]: 'text-cyan-700 bg-cyan-100',
    [ExportMaterialType.RETURN]: 'text-indigo-700 bg-indigo-100',
    [ExportMaterialType.CANCEL]: 'text-pink-700 bg-pink-100',
    [ExportMaterialType.OTHER]: 'text-slate-700 bg-slate-100',
};

type ExportMaterialTypeBadgeProps = {
    type: ExportMaterialType;
};


const ExportMaterialTypeBadge = ({ type }: ExportMaterialTypeBadgeProps) => {
    const colorClass = typesColors[type] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
    {ExportMaterialTypeVietnamese[type] || type}
    </span>
    );
};

export default ExportMaterialTypeBadge;

