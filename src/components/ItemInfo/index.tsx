import React from 'react';

interface ItemInfoProps {
    label: string;
    value: string | React.ReactNode;
    gridColumns?: string;
    colSpan1?: string;
    colSpan2?: string;
}

const ItemInfo = ({ label, value, gridColumns = 'grid-cols-3', colSpan1 = '', colSpan2 = 'col-span-2' }: ItemInfoProps) => {
    return (
        <div className={`grid ${gridColumns}`}>
            <div className={`font-medium ${colSpan1}`}>{label}:</div>
            <div className={`${colSpan2} font-normal text-gray-800`}>{value}</div>
        </div>
    );
};

export default ItemInfo;