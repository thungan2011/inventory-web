import React from 'react';
import { ImportProductStatus, ImportProductStatusVietnamese } from '@/modules/imports/products/interface';

const statusColors: Record<ImportProductStatus, string> = {
    [ImportProductStatus.COMPLETED]: 'text-green-600 bg-green-100',
    [ImportProductStatus.TEMPORARY]: 'text-yellow-500 bg-yellow-100',
};

type ImportProductStatusBadgeProps = {
    status: ImportProductStatus;
};


const ImportProductStatusBadge = ({ status }: ImportProductStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
    {ImportProductStatusVietnamese[status] || status}
    </span>
    );
};

export default ImportProductStatusBadge;

