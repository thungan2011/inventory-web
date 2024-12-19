import React from 'react';
import { OrderStatus } from '@/modules/orders/interface';

const statusColors = {
    [OrderStatus.PROCESSED]: 'text-green-500 bg-green-100',
    [OrderStatus.DELIVERED]: 'text-purple-700 bg-purple-100',
    [OrderStatus.SHIPPING]: 'text-blue-600 bg-blue-100',
    [OrderStatus.PENDING]: 'text-yellow-400 bg-yellow-100',
    [OrderStatus.CANCELLED]: 'text-red-600 bg-red-100',
    [OrderStatus.RETURNED]: 'text-cyan-700 bg-cyan-100',
    [OrderStatus.DRAFT]: 'text-indigo-700 bg-violet-100',
    [OrderStatus.PARTIAL_SHIPPING]: 'text-indigo-700 bg-violet-100',
};

export const OrderStatusVietnamese : Record<OrderStatus, string> = {
    [OrderStatus.PROCESSED]: 'Đã giao',
    [OrderStatus.DELIVERED]: 'Đã giao',
    [OrderStatus.SHIPPING]: 'Đang giao',
    [OrderStatus.PENDING]: 'Chờ xử lý',
    [OrderStatus.CANCELLED]: 'Đơn hủy',
    [OrderStatus.RETURNED]: 'Trả hàng/Hoàn tiền',
    [OrderStatus.DRAFT]: 'Đơn nháp',
    [OrderStatus.PARTIAL_SHIPPING]: 'Giao một phần',
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50`}>
            {OrderStatusVietnamese[status]}
        </span>
    );
};

export default OrderStatusBadge;