'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import { useAllProductHistories } from '@/modules/product-histories/repository';
import { ProductHistoryOverview } from '@/modules/product-histories/inteface';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import ProductActionTypeBadge from '@/components/Badge/ProductActionTypeBadge';
import { useAllStorageAreas } from '@/modules/storage-area/repository';
import { StorageAreaStatus, StorageAreaType } from '@/modules/storage-area/interface';
import Select, { SelectProps } from '@/components/Select';

interface MaterialHistoryFilter extends PaginationState {
    searchProduct: string;
    storageAreaId: number | 'ALL';
}

const ProductHistoryPage = () => {
    const [storageAreaSearchTerm, setStorageAreaSearchTerm] = useState<string>('');

    const [filters, setFilters] = useState<MaterialHistoryFilter>({
        page: 1,
        searchProduct: '',
        storageAreaId: 'ALL',
    });

    const materialHistoryQuery = useAllProductHistories({
        page: filters.page,
        search_product: filters.searchProduct,
        storage_area_id: filters.storageAreaId === 'ALL' ? undefined : filters.storageAreaId,
    });

    const storageAreaQuery = useAllStorageAreas({
        name: storageAreaSearchTerm,
        status: StorageAreaStatus.ACTIVE,
        type: StorageAreaType.PRODUCT,
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

    const columns = React.useMemo<ColumnDef<ProductHistoryOverview>[]>(
        () => [
            {
                accessorKey: 'productStorageHistory.product',
                header: 'Sản phẩm',
                cell: ({ row }) => {
                    const { product } = row.original.productStorageHistory;

                    return (
                        <div className="flex gap-2">
                            <div className="relative h-16 w-16">
                                <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                       alt={`Ảnh nguyên thành phẩm ${product.name}`} fill
                                       className="object-cover rounded border shadow" />
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <div className="text-nowrap text-ellipsis overflow-hidden max-w-60 w-60"
                                     title={product.name}>{`#${product.sku} - ${product.name}`}</div>
                                <div
                                    className="text-xs text-gray-700">{`${product.weight}${product.unit}/${product.packing}`} </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'productStorageHistory.storageArea',
                header: 'Khu vực',
                cell: ({ row }) => {
                    const { storageArea } = row.original.productStorageHistory;

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
                cell: ({ row }) => <ProductActionTypeBadge type={row.original.actionType} />,
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
                                    <Input name="searchProduct" placeholder="SKU hoặc tên thành phẩm" />
                                    <Select name="storageAreaId"
                                            searchPlaceholder="Nhập tên khu vực"
                                            placeholder="Chọn khu vực lưu trữ"
                                            options={storageAreaOptions}
                                            enableSearch
                                            onSearch={setStorageAreaSearchTerm}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ProductHistoryOverview> data={histories} columns={columns} currentPage={currentPage}
                                                   totalPages={totalPages}
                                                   onChangePage={onPageChange}
                                                   isLoading={isLoading}
                    />
                </Card>
            </div>
        </>
    );
};

export default ProductHistoryPage;