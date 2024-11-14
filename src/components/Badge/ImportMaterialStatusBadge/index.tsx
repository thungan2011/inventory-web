import React from 'react';
import { ImportMaterialStatus, ImportMaterialStatusVietnamese } from '@/modules/imports/materials/interface';

const statusColors: Record<ImportMaterialStatus, string> = {
    [ImportMaterialStatus.REJECTED]: 'text-red-600 bg-red-100',
    [ImportMaterialStatus.PENDING_APPROVED]: 'text-yellow-500 bg-yellow-100',
    [ImportMaterialStatus.APPROVED]: 'text-blue-500 bg-blue-200',
    [ImportMaterialStatus.COMPLETED]: 'text-green-500 bg-green-100',
};

type ImportMaterialStatusBadgeProps = {
    status: ImportMaterialStatus;
};

const ImportMaterialStatusBadge = ({ status }: ImportMaterialStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
            {ImportMaterialStatusVietnamese[status] || status}
        </span>
    );
};
export default ImportMaterialStatusBadge;
