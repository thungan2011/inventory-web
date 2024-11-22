'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Card from '@/components/Card';
import Table from '@/components/Tables';

import ImportProductStatusBadge from '@/components/Badge/ImportProductStatusBadge';
import {
    ImportProductOverview,
    ImportProductStatus,
    ImportProductStatusVietnamese,
    ImportProductType,
    ImportProductTypesVietnamese,
} from '@/modules/imports/products/interface';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllImportProducts } from '@/modules/imports/products/reponsitory';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import ImportProductTypesBadge from '@/components/Badge/ImportProductTypesBadge';

interface ImportProductFilter extends PaginationState {
    search: string;
}

const ImportProductPage = () => {

    const initialFilterValues = {
        page: 1,
        search: '',
    };
    const [filters, setFilters] = useState<ImportProductFilter>(initialFilterValues);
    const importProductQuery = useAllImportProducts({
        page: filters.page,
    });

    const {
        data: importProducts,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: importProductQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Nhập kho';
    }, []);

    const columns = React.useMemo<ColumnDef<ImportProductOverview>[]>(
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
                accessorKey: 'full_name',
                header: 'Người lập phiếu',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.creator.fullName}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: 'Ngày lập phiếu',
                cell: ({ row }) => {
                    return formatDateToLocalDate(row.original.createdAt);
                },
            },
            {
                accessorKey: 'type',
                header: 'Loại giao dịch',
                cell: ({ row }) => <ImportProductTypesBadge type={row.original.type} />,
            },
            // {
            //     accessorKey: 'note',
            //     header: () => <span>Ghi chú</span>,
            // },
            {
                accessorKey: 'status',
                header: () => <span>Trạng thái</span>,
                cell: ({ row }) => <ImportProductStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/imports/products/${row.original.code}`} />
                        {/*<ButtonAction.Update />*/}
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = () => {
        exportToExcel<ImportProductOverview>(importProducts, [], 'importProducts.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/imports/products/new'} />
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
                                <div className="grid grid-cols-3 gap-4">
                                    <Input name="search" placeholder="Mã phiếu nhập" />
                                    <Input name="search" placeholder="Người lập phiếu" />
                                    <Input name="search" placeholder="Ngày lập phiếu" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <Select name="type"
                                            placeholder="Lọc theo loại"
                                            options={[
                                                { label: 'Tất cả loại', value: 'ALL' },
                                                ...Object.values(ImportProductType).map(value => ({
                                                    label: ImportProductTypesVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(ImportProductStatus).map(value => ({
                                                    label: ImportProductStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ImportProductOverview> data={importProducts} columns={columns} currentPage={currentPage}
                                                  totalPages={totalPages}
                                                  isLoading={isLoading}
                                                  onChangePage={onPageChange} />
                </Card>
            </div>
        </>
    );
};

export default ImportProductPage;