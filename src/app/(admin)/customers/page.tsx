'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { CustomerOverview, CustomerStatus } from '@/modules/customers/interface';
import CustomerStatusBadge, { CustomerStatusVietnamese } from '@/components/Badge/CustomerStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllCustomers, useDeleteCustomer } from '@/modules/customers/repository';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';

interface CustomerFilter extends PaginationState {
    name: string;
    code: string;
    status: CustomerStatus | 'ALL';
    phone: string;
}

const CustomerPage = () => {

    const [filters, setFilters] = useState<CustomerFilter>({
        page: 1,
        name: '',
        code: '',
        status: 'ALL',
        phone: '',
    });
    const customerQuery = useAllCustomers({
        page: filters.page,
        name: filters.name,
        code: filters.code,
        phone: filters.phone,
        status: filters.status === 'ALL' ? undefined : filters.status
    });

    const {
        data: customers,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: customerQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });
    const deleteCustomer = useDeleteCustomer();

    const deleteModal = useDeleteModal<CustomerOverview>({
        onDelete: async (data) => {
            await deleteCustomer.mutateAsync(data.id);
        },
        canDelete: data => data.status !== CustomerStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa khách hàng đang hoạt động',
        onSuccess: () => {
            setFilters(prevState => ({ ...prevState, page: 1 }));
        },
    });


    useEffect(() => {
        document.title = 'Nut Garden - Khách hàng';
    }, []);

    const columns = React.useMemo<ColumnDef<CustomerOverview>[]>(
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
                accessorKey: 'name_customer',
                header: 'Tên khách hàng',
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
            //     accessorKey: 'birthday',
            //     header: 'Sinh nhật',
            //     cell: ({ row }) => row.original?.birthday ? formatDateToLocalDate(row.original.birthday) : 'Chưa cập nhật',
            // },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) => row.original.email || 'Chưa cập nhật',
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/customers/${row.original.code}`} />
                        <ButtonAction.Update />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
            },
        ],
        [deleteModal],
    );

    const handleExportExcel = () => {
        // exportToExcel<CustomerOverview>(customers, 'customers.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/customers/new'} />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className="py-4">
                    <Formik initialValues={filters} onSubmit={onFilterChange} enableReinitialize>
                        <Form>
                            <div className="px-4 pb-3">
                                <Typography.Title level={4}>Bộ lọc</Typography.Title>
                                <div className="grid grid-cols-4 gap-4">
                                    <Input name="code" placeholder="Mã khách hàng" />
                                    <Input name="name" placeholder="Tên khách hàng" />
                                    <Input name="phone" placeholder="Số điện thoại" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(CustomerStatus).map(value => ({
                                                    label: CustomerStatusVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<CustomerOverview> data={customers} columns={columns} currentPage={currentPage}
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
                                  <>Bạn có chắc chắn muốn xóa khách hàng {deleteModal.selectedData?.name} này không?</>
                              }
            />
        </>
    );
};

export default CustomerPage;