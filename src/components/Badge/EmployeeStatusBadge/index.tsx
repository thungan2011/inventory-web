import React from 'react';
import { EmployeeStatus } from '@/modules/employees/interface';

const statusColors = {
    [EmployeeStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [EmployeeStatus.INACTIVE]: 'text-red-600 bg-red-200',

};
export const EmployeeStatusVietnamese : Record<EmployeeStatus, string> = {
    [EmployeeStatus.ACTIVE]: 'Đang hoạt động',
    [EmployeeStatus.INACTIVE]: 'Ngưng hoạt động',
};


const EmployeeStatusBadge = ({ status }: { status: EmployeeStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === EmployeeStatus.ACTIVE && 'Đang hoạt động'}
            {status === EmployeeStatus.INACTIVE && 'Không hoạt động'}
        </span>
    );
};

export default EmployeeStatusBadge;