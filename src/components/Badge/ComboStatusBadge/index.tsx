import React from 'react';
import { ComboStatus } from '@/modules/combos/interface';

const statusColors = {
    [ComboStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [ComboStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [ComboStatus.OUT_OF_STOCK]: 'text-yellow-500 bg-yellow-100',

};

export const ComboStatusVietnamese : Record<ComboStatus, string> = {
    [ComboStatus.ACTIVE]: 'Đang bán',
    [ComboStatus.INACTIVE]: 'Ngừng bán',
    [ComboStatus.OUT_OF_STOCK]: 'Hết hàng',
};

const ComboStatusBadge = ({ status }: { status: ComboStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === ComboStatus.INACTIVE && 'Ngừng bán'}
            {status === ComboStatus.ACTIVE && 'Đang bán'}
            {status === ComboStatus.OUT_OF_STOCK && 'Hết hàng'}
        </span>
    );
};

export default ComboStatusBadge;