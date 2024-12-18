'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { OrderOverview, OrderStatus } from '@/modules/orders/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { formatDateInOrder, formatDateToLocalDate, timeFromNow } from '@/utils/formatDate';
import OrderStatusBadge, { OrderStatusVietnamese } from '@/components/Badge/OrderStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllOrders } from '@/modules/orders/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import dayjs from 'dayjs';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';

interface OrderFilter extends PaginationState {
    customer_name: string;
    phone: string;
    code: string;
    status: 'ALL' | OrderStatus;
}

const exportColumns: ExcelColumn[] = [
    {
        field: 'code',
        header: 'Mã đơn hàng',
    },
    {
        field: 'orderDate',
        header: 'Ngày đặt',
    },
    {
        field: 'deliveryDate',
        header: 'Ngày giao',
    },
    {
        field: 'customer.name',
        header: 'Tên khách hàng',
    },
    {
        field: 'customer.phone',
        header: 'Số điện thoại',
    },
    {
        field: 'customer.address',
        header: 'Địa chỉ',
    },
    {
        field: 'customer.ward',
        header: 'Phường/Xã',
    },
    {
        field: 'customer.district',
        header: 'Quận/Huyện',
    },
    {
        field: 'customer.city',
        header: 'Tỉnh/thành phố',
    },
    {
        field: 'totalPrice',
        header: 'Tổng tiền',
    },
    {
        field: 'status',
        header: 'Trạng thái',
        formatter: (value: OrderStatus) => OrderStatusVietnamese[value],
    },
];

const OrderPage = () => {

    useEffect(() => {
        document.title = 'Nut Garden - Đơn hàng';
    }, []);

    const [filters, setFilters] = useState<OrderFilter>({
        page: 1,
        customer_name: '',
        code: '',
        phone: '',
        status: 'ALL',
    });

    const orderQuery = useAllOrders({
        page: filters.page,
        status: filters.status === 'ALL' ? undefined : filters.status,
        customer_name: filters.customer_name,
        code: filters.code,
        phone: filters.phone,
    });

    const {
        data: orders,
        currentPage,
        totalPages,
        isLoading,
        onPageChange,
        onFilterChange,
    } = useFilterPagination({
        queryResult: orderQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });


    const columns = React.useMemo<ColumnDef<OrderOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.code}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'name_customer',
                header: 'Khách hàng',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.customer.name}</div>
                        <div className="text-xs text-gray-700">{row.original.phone}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'orderDate',
                header: 'Thời gian đặt',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{formatDateInOrder(row.original.orderDate)}</div>
                        <div className="text-xs text-gray-700">{timeFromNow(row.original.orderDate)}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'deliveryDate',
                header: 'Ngày giao',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{formatDateToLocalDate(row.original.orderDate)}</div>
                        {row.original.status === OrderStatus.PENDING && (
                            <div className={`text-xs ${
                                dayjs(row.original.orderDate).isSame(dayjs(), 'day')
                                    ? 'text-yellow-500'
                                    : dayjs(row.original.orderDate).isAfter(dayjs())
                                        ? 'text-gray-600'
                                        : 'text-red-600'
                            }`}>
                                {(() => {
                                    const orderDate = dayjs(row.original.orderDate);
                                    if (orderDate.isSame(dayjs(), 'day')) {
                                        return 'Giao trong ngày';
                                    }
                                    if (orderDate.isAfter(dayjs())) {
                                        return `${timeFromNow(row.original.orderDate)}`;
                                    }
                                    return `Quá hạn giao`;
                                })()}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'totalPrice',
                cell: ({ row }) => formatNumberToCurrency(row.original.totalPrice),
                header: 'Tổng tiền hàng',
            },

            {
                accessorKey: 'status',
                cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
                header: () => <span>Trạng thái</span>,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/orders/${row.original.code}`} />
                        <ButtonAction.Update href={`/orders/${row.original.code}/edit`} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<OrderOverview>(orders, exportColumns, 'don-hang.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Tạo đơn" href={'/orders/new'} />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className={'py-4'}>
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-4">
                                    <Input name="code" placeholder="Mã đơn hàng" />
                                    <Input name="customer_name" placeholder="Tên khách hàng" />
                                    <Input name="phone" placeholder="Số điện thoại" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(OrderStatus).map(value => ({
                                                    label: OrderStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<OrderOverview> data={orders} columns={columns} currentPage={currentPage}
                                          totalPages={totalPages}
                                          onChangePage={onPageChange}
                                          isLoading={isLoading} />
                </Card>
            </div>
        </>
    );
};

export default OrderPage;