'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import {
    WarehouseAreaMaterialOverview,
    WarehouseAreaMaterialStatus,
} from '@/modules/warehouse-area/materials/interface';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllWarehouseAreaMaterials } from '@/modules/warehouse-area/materials/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import { formatDateToLocalDate, timeFromNow } from '@/utils/formatDate';
import WarehouseAreaMaterialBadge, {
    WarehouseAreaMaterialStatusVietnamese,
} from '@/components/Badge/WarehouseAreaMaterialBadge';
import Select from '@/components/Filters/Select';
import dayjs from 'dayjs';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';

interface WarehouseAreaMaterialFilter extends PaginationState {
    materialSearch: string;
    search: string;
    status: WarehouseAreaMaterialStatus | 'ALL';
}

const WarehouseAreaMaterialPage = () => {

    const [filters, setFilters] = useState<WarehouseAreaMaterialFilter>({
        page: 1,
        materialSearch: '',
        search: '',
        status: 'ALL',
    });

    const warehouseAreaMaterialQuery = useAllWarehouseAreaMaterials({
        page: filters.page,
        material_search: filters.materialSearch,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: warehouseAreaMaterials,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: warehouseAreaMaterialQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Lưu kho NVL';
    }, []);

    const columns = React.useMemo<ColumnDef<WarehouseAreaMaterialOverview>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Khu vực lưu kho',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.storageArea.name}</div>
                        <div className="text-xs text-gray-700">{`Mã: `}{row.original.storageArea.code}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'material',
                header: 'Nguyên vật liệu',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <div className="relative h-16 w-16">
                            <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh nguyên vật liệu ${row.original.material.name}`} fill
                                   className="object-cover rounded border shadow" />
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <div className="text-nowrap text-ellipsis overflow-hidden max-w-80"
                                 title={row.original.material.name}>{`#${row.original.material.sku} - ${row.original.material.name}`}</div>
                            <div
                                className="text-xs text-gray-700">{`${row.original.material.weight}${row.original.material.unit}/${row.original.material.packing}`} </div>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'expiryDate',
                header: 'Ngày hết hạn',
                cell: ({ row }) => {
                    const isExpired = dayjs(row.original.expiryDate).isBefore(dayjs());
                    const isNearExpiry = dayjs(row.original.expiryDate).isBefore(dayjs().add(1, 'month'));

                    return (
                        <div className="flex flex-col gap-2">
                            <div>{formatDateToLocalDate(row.original.expiryDate)}</div>
                            <div className={`text-xs`}>
                                {
                                    isExpired ? (
                                        <div className="text-red-500 bg-red-50 border w-fit border-red-500 rounded px-1 py-0.5">Đã hết hạn</div>
                                    ) : (
                                        <div className={`${isNearExpiry ? 'text-yellow-500' : 'text-gray-800'}`}>
                                            Hết hạn trong {timeFromNow(row.original.expiryDate)}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    );
                }
            },
            {
                accessorKey: 'quantityAvailable',
                cell: ({ row }) => <div>{`${row.original.quantityAvailable} ${row.original.material.packing}`}</div>,
                header: 'Số lượng tồn',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <WarehouseAreaMaterialBadge status={row.original.status} />,
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
        ], [],
    );

    const handleExportExcel = () => {

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
                                    <Input name="materialSearch" placeholder="SKU hoặc tên nguyên vật liệu" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(WarehouseAreaMaterialStatus).map(value => ({
                                                    label: WarehouseAreaMaterialStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<WarehouseAreaMaterialOverview> data={warehouseAreaMaterials} columns={columns}
                                                          currentPage={currentPage}
                                                          totalPages={totalPages}
                                                          onChangePage={onPageChange}
                                                          isLoading={isLoading} />
                </Card>
            </div>
        </>
    );
};

export default WarehouseAreaMaterialPage;