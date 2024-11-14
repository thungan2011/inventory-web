import React from 'react';

export enum GenderStatus {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

const statusColors = {
    [GenderStatus.MALE]: 'text-yellow-500 bg-yellow-100',
    [GenderStatus.FEMALE]: 'text-green-500 bg-green-100',
    [GenderStatus.OTHER]: 'text-blue-500 bg-blue-200',
};

export const GenderStatusVietnamese : Record<GenderStatus, string> = {
    [GenderStatus.MALE]: 'Nam',
    [GenderStatus.FEMALE]: 'Nữ',
    [GenderStatus.OTHER]: 'Khác',
};

const GenderStatusBadge = ({ status }: { status: GenderStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50`}>
            {status === GenderStatus.MALE && 'Nam'}
            {status === GenderStatus.FEMALE && 'Nữ'}
            {status === GenderStatus.OTHER && 'Khác'}
        </span>
    );
};

export default GenderStatusBadge;