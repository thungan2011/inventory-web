'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { exportToExcel } from '@/utils/exportToExcel';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { WarehouseAreaProductOverview, WarehouseAreaProductStatus } from '@/modules/warehouse-area/products/interface';
import WarehouseAreaProductStatusBadge, {
    WarehouseAreaProductStatusVietnamese,
} from '@/components/Badge/WarehouseAreaProductBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllWarehouseAreaProducts } from '@/modules/warehouse-area/products/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';
import DatePicker from '@/components/DatePicker';

interface WarehouseAreaProductFilter extends PaginationState {
    search: string;
}

const WarehouseAreaProductPage = () => {

    const [filters, setFilters] = useState<WarehouseAreaProductFilter>({
        page: 1,
        search: '',
    });

    const warehouseAreaProductQuery = useAllWarehouseAreaProducts({
        page: filters.page,
    });

    const {
        data: warehouseAreaProducts,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: warehouseAreaProductQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Khu vực lưu trữ';
    }, []);

    const columns = React.useMemo<ColumnDef<WarehouseAreaProductOverview>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Khu vực lưu kho',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.storageArea.name}</div>
                        <div className="text-xs text-gray-700">{`ID: `}{row.original.storageArea.code}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'product',
                header: 'Thành phẩm',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div className="text-nowrap text-ellipsis overflow-hidden max-w-80"
                             title={row.original.product.name}>{`#${row.original.product.sku} - ${row.original.product.name}`}</div>
                        <div
                            className="text-xs text-gray-700">{`${row.original.product.weight}${row.original.product.unit}/${row.original.product.packing}`} </div>
                    </div>
                ),
            },
            {
                accessorKey: 'expiryDate',
                header: 'Ngày hết hạn',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{formatDateInOrder(row.original.expiryDate)}</div>
                        <div className="text-xs text-gray-700">{timeFromNow(row.original.expiryDate)}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'quantity',
                cell: ({ row }) => <div>{`${row.original.quantity} ${row.original.product.packing}`}</div>,
                header: 'Số lượng',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <WarehouseAreaProductStatusBadge status={row.original.status} />,
                header: () => <span>Trạng thái</span>,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({}) => (
                    <div className="inline-flex gap-2 items-center">
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = () => {
        exportToExcel<WarehouseAreaProductOverview>(warehouseAreaProducts, [], 'warehouseAreaProducts.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Import />
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
                                    <Input name="search" placeholder="Mã hoặc tên khu vực lưu trữ" />
                                    <Input name="search" placeholder="SKU hoặc tên nguyên vật liệu" />
                                    <DatePicker name="expiryDate" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(WarehouseAreaProductStatus).map(value => ({
                                                    label: WarehouseAreaProductStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<WarehouseAreaProductOverview> data={warehouseAreaProducts} columns={columns}
                                                         currentPage={currentPage}
                                                         totalPages={totalPages}
                                                         onChangePage={onPageChange}
                                                         isLoading={isLoading} />
                </Card>
            </div>
        </>
    );
};

export default WarehouseAreaProductPage;