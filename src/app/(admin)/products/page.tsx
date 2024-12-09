'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { ProductOverview, ProductStatus } from '@/modules/products/interface';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ProductStatusBadge, { ProductStatusVietnamese } from '@/components/Badge/ProductStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllProducts, useDeleteProduct } from '@/modules/products/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';

interface ProductFilter extends PaginationState {
    search: string;
    origin: string;
    packing: string;
    status: ProductStatus | 'ALL';
}

const exportColumns: ExcelColumn[] = [
    {
        field: 'sku',
        header: 'SKU',
    },
    {
        field: 'name',
        header: 'Tên thành phẩm',
    },
    {
        field: 'origin',
        header: 'Xuất xứ',
    },
    {
        field: 'weight',
        header: 'Khối lượng',
    },
    {
        field: 'unit',
        header: 'Đơn vị',
    },
    {
        field: 'packing',
        header: 'Đóng gói',
    },
    {
        field: 'prices.price',
        header: 'Gía hiện tại',
    },
    {
        field: 'minimumStockLevel',
        header: 'Số lượng cảnh báo tối thiểu',
    },
    {
        field: 'maximumStockLevel',
        header: 'Số lượng cảnh báo tối đa',
    },
    {
        field: 'description',
        header: 'Mô tả',
    },
    {
        field: 'status',
        header: 'Trạng thái',
        formatter: (value: ProductStatus) => ProductStatusVietnamese[value],
    },
];

const ProductPage = () => {

    const [filters, setFilters] = useState<ProductFilter>({
        page: 1,
        search: '',
        packing: '',
        origin: '',
        status: 'ALL',
    });

    const productQuery = useAllProducts({
        page: filters.page,
        search: filters.search,
        origin: filters.origin,
        packing: filters.packing,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });
    const deleteProduct = useDeleteProduct();

    const {
        data: products,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: productQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<ProductOverview>({
        onDelete: async (data) => {
            await deleteProduct.mutateAsync(data.id);
        },
        canDelete: data => data.status !== ProductStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa sản phẩm đang hoạt động!',
        onSuccess: () => {
            setFilters(prevState => ({ ...prevState, page: 1 }));
        },
    });

    useEffect(() => {
        document.title = 'Nut Garden - Sản phẩm';
    }, []);

    const columns = React.useMemo<ColumnDef<ProductOverview>[]>(
        () => [
            {
                accessorKey: 'sku',
                header: 'SKU',
            },
            {
                accessorKey: 'name',
                header: 'Tên thành phẩm',
                cell: ({ row }) => {
                    return (
                        <div className="flex gap-2">
                            <div className="relative border shadow w-14 h-14 rounded overflow-hidden">
                                <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                       alt={`Ảnh của sản phẩm ${row.original.name}`} fill
                                       className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex gap-2 items-center">
                                    <div className="max-w-72 line-clamp-2">{row.original.name}</div>
                                </div>
                                <div className="text-xs text-gray-700">{row.original.origin}</div>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'quantityAvailable',
                header: 'Tồn kho',
                cell: ({ row }) => {
                    const { quantityAvailable, minimumStockLevel, maximumStockLevel } = row.original;
                    return (
                        <div className="flex gap-2 items-center">
                            <div
                                className={`flex justify-center items-center rounded py-0.5 w-14 font-medium bg-gray-50`}>
                                {row.original.quantityAvailable}
                            </div>
                            {
                                quantityAvailable === 0 && (
                                    <div className="text-red-500 bg-red-50 rounded-full px-2 py-1 text-xs text-nowrap">
                                        Hết hàng
                                    </div>
                                )
                            }
                            {
                                minimumStockLevel && quantityAvailable !== 0 && quantityAvailable <= minimumStockLevel && (
                                    <div className="text-yellow-500 bg-yellow-50 rounded-full px-2 py-1 text-xs">
                                        Cận tồn (Min: {minimumStockLevel})
                                    </div>
                                )
                            }
                            {
                                maximumStockLevel && quantityAvailable >= maximumStockLevel && (
                                    <div className="text-green-500 bg-green-50 rounded-full px-2 py-1 text-xs">
                                        Đã đủ (Max: {maximumStockLevel})
                                    </div>
                                )
                            }
                        </div>
                    );
                },
            },
            {
                accessorKey: 'price',
                header: 'Giá hiện tại',
                cell: ({ row }) => (
                    <div
                        className="text-nowrap">{row.original?.prices[0]?.price ? formatNumberToCurrency(row.original.prices[0].price) : 'Chưa cập nhật'}</div>
                ),
            },
            {
                accessorKey: 'packing',
                header: 'Đóng gói',
            },
            {
                accessorKey: 'weight',
                header: 'Khối lượng',
                cell: ({ row }) => <div>{`${row.original.weight} ${row.original.unit}`}</div>,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                accessorKey: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/products/${row.original.sku}`} />
                        <ButtonAction.Update href={`/products/${row.original.sku}/edit`} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = async () => {
        await exportToExcel<ProductOverview>(products, exportColumns, 'thanh-pham.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/products/new'} />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className={'py-4'}>
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-x-3">
                                    <Input name="search" placeholder="SKU hoặc tên thành phẩm" />
                                    <Input name="packing" placeholder="Bao bì/đóng gói" />
                                    <Input name="origin" placeholder="Xuất xứ" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(ProductStatus).map(value => ({
                                                    label: ProductStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ProductOverview> data={products} columns={columns} currentPage={currentPage}
                                            totalPages={totalPages}
                                            onChangePage={onPageChange}
                                            isLoading={isLoading} />
                </Card>
            </div>

            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={
                                  <>Bạn có chắc chắn muốn xóa sản phẩm {deleteModal.selectedData?.name} này không?</>
                              }
            />
        </>
    );
};

export default ProductPage;