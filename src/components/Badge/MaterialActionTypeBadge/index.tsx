import React from 'react';
import { MaterialActionType, MaterialActionTypeVietnamese } from '@/modules/material-histories/inteface';


const typesColors: Record<MaterialActionType, string> = {
    [MaterialActionType.EXPORT_NORMAL]: 'text-blue-700 bg-blue-100',
    [MaterialActionType.EXPORT_RETURN]: 'text-red-700 bg-red-100',
    [MaterialActionType.IMPORT_NORMAL]: 'text-green-700 bg-green-100',
    [MaterialActionType.IMPORT_RETURN]: 'text-orange-700 bg-orange-100',
};

type MaterialActionTypeBadgeProps = {
    type: MaterialActionType;
};


const MaterialActionTypeBadge = ({ type }: MaterialActionTypeBadgeProps) => {
    const colorClass = typesColors[type] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
        {MaterialActionTypeVietnamese[type] || type}
    </span>
    );
};

export default MaterialActionTypeBadge;

