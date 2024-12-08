'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';

import { formatDateToLocalDate } from '@/utils/formatDate';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import ImportMaterialStatusBadge from '@/components/Badge/ImportMaterialStatusBadge';
import {
    ImportMaterialOverview,
    ImportMaterialStatus,
    ImportMaterialStatusVietnamese,
    ImportMaterialType,
    ImportMaterialTypeVietnamese,
} from '@/modules/imports/materials/interface';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllImportMaterials } from '@/modules/imports/materials/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import ImportMaterialTypeBadge from '@/components/Badge/ImportMateriaTypeBadge';
import { SelectProps } from '@/components/Select';

interface ImportMaterialFilter extends PaginationState {
    code: string;
    type: ImportMaterialType | 'ALL';
    status: ImportMaterialStatus | 'ALL';
}

const ImportMaterialPage = () => {
    const initialFilterValues : ImportMaterialFilter = {
        page: 1,
        code: '',
        type: 'ALL',
        status: 'ALL',
    };
    const [filters, setFilters] = useState<ImportMaterialFilter>(initialFilterValues);
    const importMaterialQuery = useAllImportMaterials({
        page: filters.page,
        code: filters.code,
        type: filters.type === 'ALL' ? undefined : filters.type,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: importMaterials,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: importMaterialQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Nhập kho';
    }, []);

    const columns = React.useMemo<ColumnDef<ImportMaterialOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã phiếu',
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
                header: () => <span>Ngày lập phiếu</span>,
                cell: ({ row }) => {
                    return formatDateToLocalDate(row.original.createdAt);
                },
            },
            {
                accessorKey: 'type',
                cell: ({ row }) => <ImportMaterialTypeBadge type={row.original.type} />,
                header: () => <span>Loại giao dịch</span>,
            },
            {
                accessorKey: 'status',
                header: () => <span>Trạng thái</span>,
                cell: ({ row }) => <ImportMaterialStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/imports/materials/${row.original.code}`} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {

    };

    const typeOptions : SelectProps['options'] = [
        { label: 'Tất cả loại', value: 'ALL' },
        ...Object.values(ImportMaterialType).map(value => ({
            label: ImportMaterialTypeVietnamese[value],
            value,
        })),
    ];

    const statusOptions : SelectProps['options'] = [
        { label: 'Tất cả trạng thái', value: 'ALL' },
        ...Object.values(ImportMaterialStatus).map(value => ({
            label: ImportMaterialStatusVietnamese[value],
            value,
        })),
    ];

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/imports/materials/new'} text="Tạo phiếu nhập" />
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
                                    <Input name="code" placeholder="Mã phiếu nhập" />
                                    <Select name="type"
                                            placeholder="Lọc theo loại"
                                            options={typeOptions}
                                    />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={statusOptions}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ImportMaterialOverview> data={importMaterials} columns={columns} currentPage={currentPage}
                                                   totalPages={totalPages}
                                                   isLoading={isLoading}
                                                   onChangePage={onPageChange} />
                </Card>
            </div>
        </>
    );
};

export default ImportMaterialPage;