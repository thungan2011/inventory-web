import React from 'react';
import { StorageAreaType } from '@/modules/storage-area/interface';

const statusColors = {
    [StorageAreaType.PRODUCT]: 'text-cyan-700 bg-cyan-100',
    [StorageAreaType.MATERIAL]: 'text-indigo-700 bg-indigo-100',

};

export const StorageAreaTypeVietnamese: Record<StorageAreaType, string> = {
    [StorageAreaType.PRODUCT]: 'Sản phẩm',
    [StorageAreaType.MATERIAL]: 'Nguyên vật liệu',
};

const StorageAreaTypeBadge = ({ type }: { type: StorageAreaType }) => {
    const colorClass = statusColors[type] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50 text-nowrap text-xs`}>
            {type === StorageAreaType.PRODUCT && 'Sản phẩm'}
            {type === StorageAreaType.MATERIAL && 'Nguyên vật liệu'}
        </span>
    );
};

export default StorageAreaTypeBadge;