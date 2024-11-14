'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Image from 'next/image';
import Card from '../../../components/Card';
import Table from '../../../components/Tables';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { ComboOverview, ComboStatus } from '@/modules/combos/interface';
import ComboStatusBadge, { ComboStatusVietnamese } from '@/components/Badge/ComboStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllCombos } from '@/modules/combos/repository';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';

interface ComboFilter extends PaginationState {
    search: string;
}

const ComboPage = () => {

    const [filters, setFilters] = useState<ComboFilter>({
        page: 1,
        search: '',
    });

    const comboQuery = useAllCombos({
        page: filters.page,
    });

    const {
        data: combos,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: comboQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<ComboOverview>({
        onDelete: async (data) => {
            console.log(data);
        },
        canDelete: data => data.status !== ComboStatus.ACTIVE,
        unableDeleteMessage: "Không thể xóa combo sản phẩm đang hoạt động.",
        onSuccess: () => {
            setFilters(prevState => ({...prevState, page: 1}));
            console.log("Thành công");
        }
    });

    useEffect(() => {
        document.title = 'Nut Garden - Hộp quà tết';
    }, []);

    const columns = React.useMemo<ColumnDef<ComboOverview>[]>(
        () => [
            {
                accessorKey: 'sku',
                header: 'Mã',
            },
            {
                accessorKey: 'image',
                cell: ({ row }) => {
                    return (
                        <div className="w-20 h-20 relative rounded shadow overflow-hidden">
                            <Image src={'/img/avatar/avt.png'} alt={row.original.name} fill
                                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                   priority className="rounded-md object-cover w-20 h-20" />
                        </div>
                    );
                },
                header: 'Ảnh',
                enableSorting: false,
            },
            {
                accessorKey: 'name',
                header: 'Tên sản phẩm',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.name}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'price',
                cell: ({ row }) => formatNumberToCurrency(row.original.prices.price),
                header: 'Giá hiện tại',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <ComboStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                accessorKey: 'description',
                header: 'Mô tả',
            },
            {
                accessorKey: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/combos/${row.original.sku}`} />
                        <ButtonAction.Update />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)}/>
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
                            <ButtonAction.Add href={'/combos/new'} />
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
                                    <Input name="search" placeholder="Mã hoặc tên combo sản phẩm" />
                                    <Input name="country" placeholder="Giá combo sản phẩm" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(ComboStatus).map(value => ({
                                                    label: ComboStatusVietnamese[value],
                                                    value,
                                                }))
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ComboOverview> data={combos} columns={columns} currentPage={currentPage}
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
                                  <>Bạn có chắc chắn muốn xóa Combo sản phẩm {deleteModal.selectedData?.name} này không?</>
                              }
            />
        </>
    );
};

export default ComboPage;