'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { exportToExcel } from '@/utils/exportToExcel';

import { formatDateToLocalDate } from '@/utils/formatDate';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import {
    ExportMaterialOverview,
    ExportMaterialStatus,
    ExportMaterialStatusVietnamese,
    ExportMaterialType,
    ExportMaterialTypeVietnamese,
} from '@/modules/exports/materials/interface';
import ExportMaterialStatusBadge from '@/components/Badge/ExportMaterialStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllExportMaterials } from '@/modules/exports/materials/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import ExportMaterialTypeBadge from '@/components/Badge/ExportMaterialTypeBadge';

interface ExportMaterialFilter extends PaginationState {
    search: string;
}

const ExportMaterialPage = () => {

    const initialFilterValues = {
        page: 1,
        search: '',
    };
    const [filters, setFilters] = useState<ExportMaterialFilter>(initialFilterValues);
    const exportMaterialQuery = useAllExportMaterials({
        page: filters.page,
    });

    const {
        data: exportMaterials,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: exportMaterialQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });


    useEffect(() => {
        document.title = 'Nut Garden - Xuất kho';
    }, []);

    const columns = React.useMemo<ColumnDef<ExportMaterialOverview>[]>(
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
                header: 'Ngày lập phiếu',
                cell: ({ row }) => {
                    return formatDateToLocalDate(row.original.createdAt);
                },
            },
            {
                accessorKey: 'type',
                cell: ({ row }) => <ExportMaterialTypeBadge type={row.original.type} />,
                header: 'Loại giao dịch',
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                cell: ({ row }) => <ExportMaterialStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/exports/materials/${row.original.code}`} />
                        {/*<ButtonAction.Update />*/}
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = () => {
        exportToExcel<ExportMaterialOverview>(exportMaterials, [], 'importMaterials.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/exports/materials/new'} />
                            <ButtonAction.Import />
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
                                        <Input name="search" placeholder="Mã phiếu xuất" />
                                        <Input name="search" placeholder="Người lập phiếu" />
                                        <Input name="search" placeholder="Ngày lập phiếu" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Select name="type"
                                                placeholder="Lọc theo loại"
                                                options={[
                                                    { label: 'Tất cả loại', value: 'ALL' },
                                                    ...Object.values(ExportMaterialType).map(value => ({
                                                        label: ExportMaterialTypeVietnamese[value],
                                                        value,
                                                    })),
                                                ]}
                                        />
                                        <Select name="status"
                                                placeholder="Lọc theo trạng thái"
                                                options={[
                                                    { label: 'Tất cả trạng thái', value: 'ALL' },
                                                    ...Object.values(ExportMaterialStatus).map(value => ({
                                                        label: ExportMaterialStatusVietnamese[value],
                                                        value,
                                                    })),
                                                ]}
                                        />
                                    </div>
                                </div>
                                <AutoSubmitForm />
                            </Form>
                        </Formik>
                        <Table<ExportMaterialOverview> data={exportMaterials} columns={columns}
                                                       currentPage={currentPage}
                                                       totalPages={totalPages}
                                                       isLoading={isLoading}
                                                       onChangePage={onPageChange} />
                    </Card>
                </Card>
            </div>
        </>
    );
};

export default ExportMaterialPage;