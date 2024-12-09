'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { MaterialOverview, MaterialStatus } from '@/modules/materials/interface';
import MaterialStatusBadge, { MaterialStatusVietnamese } from '@/components/Badge/MaterialStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllMaterials, useDeleteMaterial } from '@/modules/materials/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';

interface MaterialFilter extends PaginationState {
    name: string;
    status: MaterialStatus | 'ALL';
    origin: string
}

const MaterialPage = () => {

    useEffect(() => {
        document.title = 'Nut Garden - Nguyên vật liệu';
    }, []);

    const [filters, setFilters] = useState<MaterialFilter>({
        page: 1,
        name: '',
        origin: '',
        status: 'ALL',
    });

    const materialQuery = useAllMaterials({
        page: filters.page,
        name: filters.name,
        origin: filters.origin,
        status: filters.status === 'ALL' ? undefined : filters.status
    });
    const deleteMaterial = useDeleteMaterial();

    const {
        data: materials,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: materialQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<MaterialOverview>({
        onDelete: async (data) => {
            await deleteMaterial.mutateAsync(data.id);
        },
        canDelete: data => data.status !== MaterialStatus.ACTIVE && data.status !== MaterialStatus.OUT_OF_STOCK,
        unableDeleteMessage: "Không thể xóa nguyên vật liệu đang hoạt động hoặc hết hàng.",
        onSuccess: () => {
            setFilters(prevState => ({...prevState, page: 1}));
        }
    });

    const columns = React.useMemo<ColumnDef<MaterialOverview>[]>(
        () => [
            {
                accessorKey: 'sku',
                header: 'SKU',
            },

            {
                accessorKey: 'name',
                header:'Tên',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.name}</div>
                        <div className="text-xs text-gray-700">{row.original.origin}</div>
                    </div>
                ),
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
                                    <div className="text-red-500 bg-red-50 rounded-full px-2 py-1 text-xs">
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
                                    <div className="text-green-500 bg-green-50 rounded-full px-2 py-1 text-xs">Đã đủ (Max: {maximumStockLevel})</div>
                                )
                            }
                        </div>
                    );
                },
            },
            {
                accessorKey: 'weight',
                header: 'Khối lượng',
                cell: ({ row }) => <div>{`${row.original.weight} ${row.original.unit}`}</div>,
            },

            {
                accessorKey: 'quantityAvailable',
                header: 'SL sẳn có',
                cell: ({ row }) => <div>{`${row.original.quantityAvailable} ${row.original.packing}`}</div>,
            },
            {
                accessorKey: 'minimum_stock_level',
                header: 'Tối thiểu',
                cell: ({ row }) => <div>{`${row.original.minimumStockLevel} ${row.original.packing}`}</div>,
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <MaterialStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/materials/${row.original.sku}`} />
                        <ButtonAction.Update href={`/materials/${row.original.sku}/edit`} />
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
                            <ButtonAction.Add href={'/materials/new'} />
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
                                    <Input name="name" placeholder="Tên nguyên vật liệu" />
                                    <Input name="quantityAvailable" placeholder="Số lượng sẳn có" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(MaterialStatus).map(value => ({
                                                    label: MaterialStatusVietnamese[value],
                                                    value,
                                                }))
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<MaterialOverview> data={materials} columns={columns} currentPage={currentPage}
                                             totalPages={totalPages}
                                             onChangePage={onPageChange}
                                             isLoading={isLoading}
                    />
                </Card>
            </div>

            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={
                                  <>Bạn có chắc chắn muốn xóa nguyên vật liệu {deleteModal.selectedData?.name} này không?</>
                              }
            />
        </>
    );
};

export default MaterialPage;