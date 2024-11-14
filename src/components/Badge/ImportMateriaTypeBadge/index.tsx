import React from 'react';
import { ImportMaterialType, ImportMaterialTypeVietnamese } from '@/modules/imports/materials/interface';


const typesColors: Record<ImportMaterialType, string> = {
    [ImportMaterialType.NORMAL]: 'text-cyan-700 bg-cyan-100',
    [ImportMaterialType.RETURN]: 'text-indigo-700 bg-indigo-100',
    [ImportMaterialType.OTHER]: 'text-slate-700 bg-slate-100',
};

type ImportMaterialTypeBadgeProps = {
    type: ImportMaterialType;
};


const ImportMaterialTypeBadge = ({ type }: ImportMaterialTypeBadgeProps) => {
    const colorClass = typesColors[type] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
    {ImportMaterialTypeVietnamese[type] || type}
    </span>
    );
};

export default ImportMaterialTypeBadge;

