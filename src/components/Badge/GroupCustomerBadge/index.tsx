import React from 'react';

const colors: Record<string, string> = {
    'Vãng lai': 'text-yellow-400 bg-yellow-100',
    'Thân thiết': 'text-purple-700 bg-purple-100',
    'Doanh nghiệp': 'text-blue-600 bg-blue-100',
};

const GroupCustomerBadge = ({ data }: { data: string }) => {
    const colorClass = colors[data] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {data}
        </span>
    );
};

export default GroupCustomerBadge;