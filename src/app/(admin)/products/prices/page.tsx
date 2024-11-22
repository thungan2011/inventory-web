'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import ButtonAction from '@/components/ButtonAction';
import { ProductPriceOverview, ProductPriceStatus } from '@/modules/product-price/interface';
import { formatDateInOrder, timeFromNow } from '@/utils/formatDate';

import Image from 'next/image';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import { useAllProductsPrice, useDeleteProductPrice } from '@/modules/product-price/repository';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';
import ModalUpdateProductPrice from '@/components/Pages/ProductPrice/ModalUpdateProductPrice';
import ModalAddProductPrice from '@/components/Pages/ProductPrice/ModalAddProductPrice';
import ProductPriceStatusBadge, { ProductPriceStatusVietnamese } from '@/components/Badge/ProductPriceStatusBadge';

interface ProductPriceFilter extends PaginationState {
    search: string;
    status: ProductPriceStatus | 'ALL';
}

const ProductPricePage = () => {

    const [productPriceToUpdate, setProductPriceToUpdate] = useState<ProductPriceOverview | null>(null);
    const [showModalAddProductPrice, setShowModalAddProductPrice] = useState<boolean>(false);

    const [filters, setFilters] = useState<ProductPriceFilter>({
        page: 1,
        search: '',
        status: 'ALL',
    });

    const productQuery = useAllProductsPrice({
        page: filters.page,
        search: filters.search,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });
    const deleteProductPrice = useDeleteProductPrice();

    const {
        data: productPrice,
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

    const deleteModal = useDeleteModal<ProductPriceOverview>({
        onDelete: async (data) => {
            await deleteProductPrice.mutateAsync(data.id);
        },
        canDelete: data => data.status !== ProductPriceStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa giá đang áp dụng.',
        onSuccess: () => {
            setFilters(prevState => ({ ...prevState, page: 1 }));
        },
    });

    useEffect(() => {
        document.title = 'Nut Garden - Bảng giá';
    }, []);

    const columns = React.useMemo<ColumnDef<ProductPriceOverview>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'dateStart',
                header: 'Ngày bắt đầu',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{formatDateInOrder(row.original.dateStart)}</div>
                        <div className="text-xs text-gray-700">{timeFromNow(row.original.dateStart)}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'dateEnd',
                header: 'Ngày kết thúc',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{formatDateInOrder(row.original.dateEnd)}</div>
                        <div className="text-xs text-gray-700">{timeFromNow(row.original.dateEnd)}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Tên sản phẩm',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <div className="relative w-14 h-14 rounded overflow-hidden">
                            <Image src={'/img/avatar/logo.png'}
                                   alt={`Ảnh của sản phẩm ${row.original.product.name}`} fill
                                   className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="text-nowrap text-ellipsis overflow-hidden max-w-60"
                                 title={row.original.product.name}>{`#${row.original.product.sku} - ${row.original.product.name}`}</div>
                            <div
                                className="text-xs text-gray-700">{`${row.original.product.weight}${row.original.product.unit} ${row.original.product.packing}`} </div>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'price',
                cell: ({ row }) => formatNumberToCurrency(row.original.price),
                header: 'Giá hiện tại',
            },
            {
                accessorKey: 'status',
                header: () => <span>Trạng thái</span>,
                cell: ({ row }) => <ProductPriceStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.Update onClick={() => setProductPriceToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = () => {
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add onClick={() => setShowModalAddProductPrice(true)} />
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
                                <div className="grid grid-cols-4 gap-x-3">
                                    <Input name="search" placeholder="SKU hoặc tên thành phẩm" />
                                    <Input name="dateStart" placeholder="Ngày bắt đầu" />
                                    <Input name="dateEnd" placeholder="Ngày kết thúc" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(ProductPriceStatus).map(value => ({
                                                    label: ProductPriceStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ProductPriceOverview> data={productPrice} columns={columns} currentPage={currentPage}
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
                                  <>Bạn có chắc chắn muốn xóa giá của sản
                                      phẩm {deleteModal.selectedData?.product.name} này không?</>
                              }
            />
            <ModalAddProductPrice onClose={() => setShowModalAddProductPrice(false)}
                                  isOpen={showModalAddProductPrice} />
            <ModalUpdateProductPrice onClose={() => setProductPriceToUpdate(null)}
                                     productPrice={productPriceToUpdate} />
        </>
    );
};

export default ProductPricePage;