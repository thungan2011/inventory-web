'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllMaterialHistories } from '@/modules/material-histories/repository';
import {
    MaterialActionType,
    MaterialActionTypeVietnamese,
    MaterialHistoryOverview,
} from '@/modules/material-histories/inteface';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import MaterialActionTypeBadge from '@/components/Badge/MaterialActionTypeBadge';
import { useAllStorageAreas } from '@/modules/storage-area/repository';
import { StorageAreaStatus, StorageAreaType } from '@/modules/storage-area/interface';
import Select, { SelectProps } from '@/components/Select';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';

interface MaterialHistoryFilter extends PaginationState {
    searchMaterial: string;
    storageAreaId: number | 'ALL';
}

const exportColumns: ExcelColumn[] = [
    {
        field: 'materialStorageHistory.material.sku',
        header: 'SKU',
    },
    {
        field: 'materialStorageHistory.material.name',
        header: 'Nguyên vật liệu',
    },
    {
        field: 'materialStorageHistory.material.weight',
        header: 'Khối lượng',
    },
    {
        field: 'materialStorageHistory.material.unit',
        header: 'Đơn vị',
    },
    {
        field: 'materialStorageHistory.material.packing',
        header: 'Đóng gói',
    },
    {
        field: 'quantityBefore',
        header: 'Số lượng trước',
    },
    {
        field: 'quantityChange',
        header: 'Số lượng thay đổi',
    },
    {
        field: 'quantityAfter',
        header: 'Số lượng sau',
    },
    {
        field: 'actionType',
        header: 'Loại',
        formatter: (value: MaterialActionType) => MaterialActionTypeVietnamese[value],
    },
];

const MaterialHistoryPage = () => {
    const [storageAreaSearchTerm, setStorageAreaSearchTerm] = useState<string>('');

    const [filters, setFilters] = useState<MaterialHistoryFilter>({
        page: 1,
        searchMaterial: '',
        storageAreaId: 'ALL',
    });

    const storageAreaQuery = useAllStorageAreas({
        name: storageAreaSearchTerm,
        status: StorageAreaStatus.ACTIVE,
        type: StorageAreaType.MATERIAL,
    });

    const materialHistoryQuery = useAllMaterialHistories({
        page: filters.page,
        search_material: filters.searchMaterial,
        storage_area_id: filters.storageAreaId === 'ALL' ? undefined : filters.storageAreaId,
    });

    const {
        data: histories,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: materialHistoryQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const storageAreaOptions: SelectProps['options'] = [
        { label: 'Tất cả khu vực', value: 'ALL' },
        ...(storageAreaQuery.data?.data || []).map((storageArea) => ({
            label: `${storageArea.code} - ${storageArea.name}`,
            value: storageArea.id,
        })),
    ];

    useEffect(() => {
        document.title = 'Nut Garden - Lịch sử lưu kho';
    }, []);

    const columns = React.useMemo<ColumnDef<MaterialHistoryOverview>[]>(
        () => [
            {
                accessorKey: 'materialStorageHistory.material',
                header: 'Nguyên vật liệu',
                cell: ({ row }) => {
                    const { material } = row.original.materialStorageHistory;

                    return (
                        <div className="flex gap-2">
                            <div className="relative h-16 w-16">
                                <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                       alt={`Ảnh nguyên vật liệu ${material.name}`} fill
                                       className="object-cover rounded border shadow" />
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <div className="text-nowrap text-ellipsis overflow-hidden max-w-60 w-60"
                                     title={material.name}>{`#${material.sku} - ${material.name}`}</div>
                                <div
                                    className="text-xs text-gray-700">{`${material.weight}${material.unit}/${material.packing}`} </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'materialStorageHistory.storageArea',
                header: 'Khu vực',
                cell: ({ row }) => {
                    const { storageArea } = row.original.materialStorageHistory;

                    return (
                        <div className="space-y-2">
                            <div className="text-nowrap text-ellipsis overflow-hidden max-w-80"
                                 title={storageArea.name}>
                                {storageArea.name}
                            </div>
                            <div className="text-xs text-gray-800">
                                Mã: {storageArea.code}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'quantityBefore',
                header: 'Số lượng trước',
            },
            {
                accessorKey: 'quantityChange',
                header: 'Số lượng thay đổi',
                cell: ({ getValue }) => {
                    const value = getValue() as number;
                    const isPositive = value > 0;

                    return (
                        <span className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? `+${value}` : value}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'quantityAfter',
                header: 'Số lượng sau',
            },
            {
                accessorKey: 'createdAt',
                header: 'Thời gian',
                cell: ({ row }) => (
                    <div>
                        <div>{formatDateInOrder(row.original.createdAt)}</div>
                        <div className="text-xs text-gray-800">{timeFromNow(row.original.createdAt)}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'actionType',
                header: 'Lý do',
                cell: ({ row }) => <MaterialActionTypeBadge type={row.original.actionType} />,
            },
        ],
        [],
    );

    const handleExportExcel = async () => {
        await exportToExcel<MaterialHistoryOverview>(histories, exportColumns, 'lich-su-giao-dich-nguyen-vat-lieu.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
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
                                    <Input name="searchMaterial" placeholder="SKU hoặc tên nguyên vật liệu" />
                                    <Select name="storageAreaId"
                                            placeholder="Chọn khu vực lưu trữ"
                                            searchPlaceholder="Nhập tên khu vực"
                                            options={storageAreaOptions}
                                            enableSearch
                                            onSearch={setStorageAreaSearchTerm}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<MaterialHistoryOverview> data={histories} columns={columns} currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onChangePage={onPageChange}
                                                    isLoading={isLoading}
                    />
                </Card>
            </div>
        </>
    );
};

export default MaterialHistoryPage;