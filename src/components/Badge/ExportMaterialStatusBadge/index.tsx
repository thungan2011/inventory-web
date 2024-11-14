import React from 'react';
import { ExportMaterialStatus, ExportMaterialStatusVietnamese } from '@/modules/exports/materials/interface';

const statusColors: Record<ExportMaterialStatus, string> = {
    [ExportMaterialStatus.COMPLETED]: 'text-green-500 bg-green-100',
    [ExportMaterialStatus.TEMPORARY]: 'text-yellow-500 bg-yellow-100',
};

type ExportMaterialStatusBadgeProps = {
    status: ExportMaterialStatus;
};


const ExportMaterialStatusBadge = ({ status }: ExportMaterialStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {ExportMaterialStatusVietnamese[status] || status}
        </span>
    );
};

export default ExportMaterialStatusBadge;