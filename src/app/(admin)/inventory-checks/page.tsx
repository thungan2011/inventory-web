'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import {
    ImportProductStatus,
    ImportProductStatusVietnamese,
    ImportProductType,
} from '@/modules/imports/products/interface';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import { ImportMaterialTypeVietnamese } from '@/modules/imports/materials/interface';
import { useAllInventoryCheck } from '@/modules/inventory-checks/repository';
import { InventoryCheckOverview, InventoryCheckStatus } from '@/modules/inventory-checks/interface';
import InventoryCheckStatusBadge from '@/components/Badge/InventoryCheckStatusBadge';
import ModalAddInventoryCheck from '@/components/Pages/InventoryCheck/ModalAddInventoryCheck';
import ModalApproveInventoryCheck from '@/components/Pages/InventoryCheck/ModalApproveInventoryCheck';
import { SelectProps } from '@/components/Select';

interface InventoryCheckFilter extends PaginationState {
    code: string;
    type: ImportProductType | 'ALL';
    status: ImportProductStatus | 'ALL';
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
        formatter: (value: ImportProductType) => ImportMaterialTypeVietnamese[value],
    },
    {
        field: 'status',
        header: 'Trạng thái',
        formatter: (value: ImportProductStatus) => ImportProductStatusVietnamese[value],
    },
    {
        field: 'createdAt',
        header: 'Ngày tạo',
    },
    {
        field: 'creator.fullName',
        header: 'Người tạo',
    },
    {
        field: 'receiver.fullName',
        header: 'Người nhận',
    },
    {
        field: 'note',
        header: 'Ghi chú',
    },
];

const InventoryCheckPage = () => {
    const [showModalAddInventoryCheck, setShowModalAddInventoryCheck] = useState<boolean>(false);
    const [inventoryCheckToApprove, setInventoryCheckApprove] = useState<InventoryCheckOverview | null>(null);

    const initialFilterValues: InventoryCheckFilter = {
        page: 1,
        code: '',
        type: 'ALL',
        status: 'ALL',
    };

    const [filters, setFilters] = useState<InventoryCheckFilter>(initialFilterValues);
    const inventoryCheckQuery = useAllInventoryCheck({
        page: filters.page,
    });

    const {
        data: checks,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: inventoryCheckQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Kiểm kê kho';
    }, []);

    const columns = React.useMemo<ColumnDef<InventoryCheckOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.id}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'checkDate',
                header: 'Ngày kiểm kê',
                cell: ({ row }) => formatDateToLocalDate(row.original.checkDate),
            },
            {
                accessorKey: 'storageArea',
                header: 'Khu vực kiểm kê',
                cell: ({ row }) => (
                    <div className="space-y-2">
                        <div className="text-nowrap text-ellipsis overflow-hidden max-w-80"
                             title={row.original.storageArea.name}>
                            {row.original.storageArea.name}
                        </div>
                        <div className="text-xs text-gray-800">
                            Mã: {row.original.storageArea.code}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'note',
                header: 'Ghi chú',
                cell: ({ row }) => (
                    <div title={row.original.note} className="max-w-80 line-clamp-2">
                        {row.original.note}
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Trạng thái',
                cell: ({ row }) => <InventoryCheckStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        {
                            row.original.status === InventoryCheckStatus.PENDING ? (
                                <ButtonAction.View onClick={() => setInventoryCheckApprove(row.original)} />
                            ) : (
                                <ButtonAction.View href={`/inventory-checks/${row.original.id}`} />
                            )
                        }
                    </div>
                ),
            },
        ],
        [],
    );

    const typeOptions : SelectProps['options'] = [
        { label: 'Tất cả loại', value: 'ALL' },
        ...Object.values(ImportProductType).map(value => ({
            label: ImportMaterialTypeVietnamese[value],
            value,
        })),
    ];

    const statusOptions : SelectProps['options'] = [
        { label: 'Tất cả trạng thái', value: 'ALL' },
        ...Object.values(ImportProductStatus).map(value => ({
            label: ImportProductStatusVietnamese[value],
            value,
        })),
    ];

    const handleExportExcel = async () => {
        await exportToExcel<InventoryCheckOverview>(checks, exportColumns, 'nhap-kho-thanh-pham.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add text="Tạo phiếu kiểm kê"
                                              onClick={() => setShowModalAddInventoryCheck(true)} />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className={'py-4'}>
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <Table<InventoryCheckOverview> data={checks} columns={columns} currentPage={currentPage}
                                                   totalPages={totalPages}
                                                   isLoading={isLoading}
                                                   onChangePage={onPageChange} />
                </Card>
            </div>

            {
                showModalAddInventoryCheck && (
                    <ModalAddInventoryCheck onClose={() => setShowModalAddInventoryCheck(false)} />
                )
            }
            {
                inventoryCheckToApprove && (
                    <ModalApproveInventoryCheck onClose={() => setInventoryCheckApprove(null)} data={inventoryCheckToApprove} />
                )
            }
        </>
    );
};

export default InventoryCheckPage;