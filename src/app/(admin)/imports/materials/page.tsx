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

interface ImportMaterialFilter extends PaginationState {
    search: string;
}

const ImportMaterialPage = () => {
    const initialFilterValues = {
        page: 1,
        search: '',
    };
    const [filters, setFilters] = useState<ImportMaterialFilter>(initialFilterValues);
    const importMaterialQuery = useAllImportMaterials({
        page: filters.page,
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
                accessorKey: 'provider',
                header: 'Nhà cung cấp',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.provider.name}</div>
                        <div className="text-xs text-gray-700">{row.original.provider.phone}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'createdAt',
                header: () => <span>Ngày giao dịch</span>,
                cell: ({ row }) => {
                    return formatDateToLocalDate(row.original.createdAt);
                },
            },
            {
                accessorKey: 'type',
                cell: ({ row }) => <ImportMaterialTypeBadge type={row.original.type} />,
                header: () => <span>Loại giao dịch</span>,
            },
            // {
            //     accessorKey: 'note',
            //     header: 'Ghi chú',
            // },
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
                        <ButtonAction.View href={`/imports/materials/${row.original.id}`} />
                        <ButtonAction.Update />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = () => {

    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/imports/materials/new'} />
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
                                                ...Object.values(ImportMaterialType).map(value => ({
                                                    label: ImportMaterialTypeVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(ImportMaterialStatus).map(value => ({
                                                    label: ImportMaterialStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
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