'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllMaterialHistories } from '@/modules/material-histories/repository';
import { MaterialHistoryOverview } from '@/modules/material-histories/inteface';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import MaterialActionTypeBadge from '@/components/Badge/MaterialActionTypeBadge';

interface MaterialHistoryFilter extends PaginationState {
    searchMaterial: string;
}

const MaterialHistoryPage = () => {

    const [filters, setFilters] = useState<MaterialHistoryFilter>({
        page: 1,
        searchMaterial: '',
    });

    const materialHistoryQuery = useAllMaterialHistories({
        page: filters.page,
        search_material: filters.searchMaterial,
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
                                <div className="text-nowrap text-ellipsis overflow-hidden max-w-80"
                                     title={material.name}>{`#${material.sku} - ${material.name}`}</div>
                                <div
                                    className="text-xs text-gray-700">{`${material.weight}${material.unit}/${material.packing}`} </div>
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

    const handleExportExcel = () => {
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