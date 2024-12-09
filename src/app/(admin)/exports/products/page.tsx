'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import {
    ExportProductOverview,
    ExportProductStatus,
    ExportProductStatusVietnamese,
    ExportProductType,
    ExportProductTypeVietnamese,
} from '@/modules/exports/products/interface';
import ExportProductStatusBadge from '@/components/Badge/ExportProductStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllExportProducts } from '@/modules/exports/products/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import ExportProductTypeBadge from '@/components/Badge/ExportProductTypeBadge';
import { SelectProps } from '@/components/Select';

interface ExportProductFilter extends PaginationState {
    code: string;
    type: ExportProductType | 'ALL';
    status: ExportProductStatus | 'ALL';
}

const exportColumns: ExcelColumn[] = [
    {
        field: 'id',
        header: 'ID',
    },
    {
        field: 'code',
        header: 'Mã giao dịch',
    },
    {
        field: 'type',
        header: 'Loại',
        formatter: (value: ExportProductType) => ExportProductTypeVietnamese[value],
    },
    {
        field: 'status',
        header: 'Trạng thái',
        formatter: (value: ExportProductStatus) => ExportProductStatusVietnamese[value],
    },
    {
        field: 'createdAt',
        header: 'Ngày tạo',
    },
    {
        field: 'note',
        header: 'Ghi chú',
    },

];

const initialFilterValues: ExportProductFilter = {
    page: 1,
    code: '',
    type: 'ALL',
    status: 'ALL',
};

const ExportProductPage = () => {
    const [filters, setFilters] = useState<ExportProductFilter>(initialFilterValues);
    const exportProductQuery = useAllExportProducts({
        page: filters.page,
        code: filters.code,
        type: filters.type === 'ALL' ? undefined : filters.type,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: exportProducts,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: exportProductQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Nhập kho';
    }, []);

    const columns = React.useMemo<ColumnDef<ExportProductOverview>[]>(
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
                cell: ({ row }) => <ExportProductTypeBadge type={row.original.type} />,
                header: 'Loại giao dịch',
            },
            {
                accessorKey: 'status',
                header: () => <span>Trạng thái</span>,
                cell: ({ row }) => <ExportProductStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/exports/products/${row.original.code}`} />
                        {/*<ButtonAction.Update />*/}
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<ExportProductOverview>(exportProducts, exportColumns, 'xuat-kho-thanh-pham.xlsx');
    };

    const typeOptions: SelectProps['options'] = [
        { label: 'Tất cả loại', value: 'ALL' },
        ...Object.values(ExportProductType).map(value => ({
            label: ExportProductTypeVietnamese[value],
            value,
        })),
    ];

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/exports/products/new'} text="Tạo phiếu xuất" />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className={'py-4'}>
                    <Card className={'py-4'}>
                        <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                            <Form>
                                <div className="px-4 pb-3">
                                    <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input name="code" placeholder="Mã phiếu xuất" />
                                        <Select name="type"
                                                placeholder="Lọc theo loại"
                                                options={typeOptions}
                                        />
                                        <Select name="status"
                                                placeholder="Lọc theo trạng thái"
                                                options={[
                                                    { label: 'Tất cả trạng thái', value: 'ALL' },
                                                    ...Object.values(ExportProductStatus).map(value => ({
                                                        label: ExportProductStatusVietnamese[value],
                                                        value,
                                                    })),
                                                ]}
                                        />
                                    </div>
                                </div>
                                <AutoSubmitForm />
                            </Form>
                        </Formik>
                        <Table<ExportProductOverview> data={exportProducts} columns={columns} currentPage={currentPage}
                                                      totalPages={totalPages}
                                                      isLoading={isLoading}
                                                      onChangePage={onPageChange} />
                    </Card>
                </Card>
            </div>
        </>
    );
};

export default ExportProductPage;