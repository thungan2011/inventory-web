'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '../../../components/Card';
import Table from '../../../components/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { ProviderOverview } from '@/modules/providers/interface';
import BaseStatusBadge from '@/components/Badge/BaseStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import useDeleteModal from '@/hook/useDeleteModal';
import { useAllProviders, useDeleteProvider } from '@/modules/providers/repository';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';

interface ProviderFilter extends PaginationState {
    name: string;
    code: string;
    status: BaseStatus | 'ALL';
    phone: string;
}

const ProviderPage = () => {

    const [filters, setFilters] = useState<ProviderFilter>({
        page: 1,
        name: '',
        code: '',
        status: 'ALL',
        phone: '',
    });
    const providerQuery = useAllProviders({
        page: filters.page,
        name: filters.name,
        code: filters.code,
        phone: filters.phone,
        status: filters.status === 'ALL' ? undefined : filters.status
    });
    const deleteProvider = useDeleteProvider();

    const {
        data: providers,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: providerQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<ProviderOverview>({
        onDelete: async (data) => {
            await deleteProvider.mutateAsync(data.id);
        },
        canDelete: data => data.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa nhà cung cấp đang hoạt động',
        onSuccess: () => {
            setFilters(prevState => ({ ...prevState, page: 1 }));
        },
    });

    useEffect(() => {
        document.title = 'Nut Garden - Nhà cung cấp';
    }, []);

    const columns = React.useMemo<ColumnDef<ProviderOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.code}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Tên',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.name}</div>
                        <div className="text-xs text-gray-700">{row.original.phone}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'address',
                header: 'Địa chỉ',
                cell: ({ row }) => {
                    if (row.original.address) {
                        return row.original.address + ', ' + row.original.ward + ', ' + row.original.district + ', ' + row.original.city;
                    } else {
                        return 'Chưa cập nhật';
                    }
                },
            },
            // {
            //     accessorKey: 'email',
            //     header: 'Email',
            //     cell: ({ row }) => row.original.email || 'Chưa cập nhật',
            // },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/providers/${row.original.code}`} />
                        <ButtonAction.Update />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = () => {
        exportToExcel<ProviderOverview>(providers, [], 'providers.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/providers/new'} />
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
                                    <Input name="code" placeholder="Mã nhà cung cấp" />
                                    <Input name="name" placeholder="Tên nhà cung cấp" />
                                    <Input name="phone" placeholder="Số điện thoại" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(BaseStatus).map(value => ({
                                                    label: BaseStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<ProviderOverview> data={providers} columns={columns} currentPage={currentPage}
                                             totalPages={totalPages}
                                             isLoading={isLoading}
                                             onChangePage={onPageChange} />
                </Card>
            </div>

            <ModalDeleteAlert onConfirm={deleteModal.handleDelete}
                              onClose={deleteModal.closeDeleteModal}
                              isOpen={deleteModal.showDeleteModal}
                              title="Xác nhận xóa?"
                              content={
                                  <>Bạn có chắc chắn muốn xóa nhà cung cấp {deleteModal.selectedData?.name} này
                                      không?</>
                              }
            />
        </>
    );
};

export default ProviderPage;