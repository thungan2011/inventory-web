'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { WarehouseAreaMaterialOverview } from '@/modules/warehouse-area/materials/interface';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllWarehouseAreaMaterials } from '@/modules/warehouse-area/materials/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import AutoSubmitForm from '@/components/AutoSubmitForm';

interface WarehouseAreaMaterialFilter extends PaginationState {
    search: string;
}

const WarehouseAreaMaterialPage = () => {

    const [filters, setFilters] = useState<WarehouseAreaMaterialFilter>({
        page: 1,
        search: '',
    });

    const warehouseAreaMaterialQuery = useAllWarehouseAreaMaterials({
        page: filters.page,
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
                        <div className="text-xs text-gray-700">{`ID: `}{row.original.storageArea.code}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'nameMaterial',
                header: 'Nguyên vật liệu',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.material.name}</div>
                        <div className="text-xs text-gray-700">{`SKU: `}{row.original.material.sku}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'quantity',
                cell: ({ row }) => <div>{`${row.original.quantity} ${row.original.material.packing}`}</div>,
                header: 'Số lượng',
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/warehouse-area/materials/${row.original.storageArea.code}`} />
                    </div>
                ),
                enableSorting: false,
            },
        ], []
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
                                    <Input name="search" placeholder="Tên khu vực lưu trữ" />
                                    <Input name="search" placeholder="Tên sản phẩm" />
                                    <Input name="search" placeholder="Số lượng từ" />
                                    <Input name="search" placeholder="Số lượng" />
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