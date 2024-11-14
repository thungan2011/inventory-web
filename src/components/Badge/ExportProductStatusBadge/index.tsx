import React from 'react';
import { ExportProductStatus, ExportProductStatusVietnamese } from '@/modules/exports/products/interface';

const statusColors: Record<ExportProductStatus, string> = {
    [ExportProductStatus.TEMPORARY]: 'text-yellow-500 bg-yellow-100',
    [ExportProductStatus.COMPLETED]: 'text-green-500 bg-green-100',
};

type ExportProductStatusBadgeProps = {
    status: ExportProductStatus;
};


const ExportProductStatusBadge = ({ status }: ExportProductStatusBadgeProps) => {
    const colorClass = statusColors[status] || 'text-gray-500';
    return (
        <span className={`px-2 py-1 rounded font-medium bg-opacity-50 text-nowrap ${colorClass}`}>
    {ExportProductStatusVietnamese[status] || status}
    </span>
    );
};

export default ExportProductStatusBadge;