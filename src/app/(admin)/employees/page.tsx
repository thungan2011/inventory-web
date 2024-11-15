'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '../../../components/Card';
import Table from '../../../components/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import { EmployeeOverview, EmployeeStatus } from '@/modules/employees/interface';
import EmployeeStatusBadge, { EmployeeStatusVietnamese } from '@/components/Badge/EmployeeStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllEmployees } from '@/modules/employees/repository';
import { formatDateToLocalDate } from '@/utils/formatDate';
import Image from 'next/image';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';

interface EmployeeFilter extends PaginationState {
    search: string;
}

const EmployeePage = () => {

    const [filters, setFilters] = useState<EmployeeFilter>({
        page: 1,
        search: '',
    });

    const employeeQuery = useAllEmployees({
        page: filters.page,
    });

    const {
        data: employees,
        currentPage,
        totalPages,
        isLoading,
        onPageChange,
        onFilterChange,
    } = useFilterPagination({
        queryResult: employeeQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<EmployeeOverview>({
        onDelete: async (data) => {
            console.log(data);
        },
        canDelete: data => data.status !== EmployeeStatus.ACTIVE,
        unableDeleteMessage: "Không thể xóa nhân viên đang hoạt động",
        onSuccess: () => {
            setFilters(prevState => ({...prevState, page: 1}));
            console.log("Thành công");
        }
    });

    useEffect(() => {
        document.title = 'Nut Garden - Nhân viên';
    }, []);

    const columns = React.useMemo<ColumnDef<EmployeeOverview>[]>(
        () => [
            {
                accessorKey: 'userId',
                header: 'Mã',
            },
            {
                accessorKey: 'avatar',
                cell: ({ row }) => {
                    return (
                        <div className="w-20 h-20 relative rounded shadow overflow-hidden">
                            <Image src={'/img/avatar/avt.png'} alt={row.original.firstName} fill
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
                header: () => <span>Tên</span>,
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{`${row.original.firstName} ${row.original.lastName}`}</div>
                        <div className="text-xs text-gray-700">{row.original.phone}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'birthday',
                header: 'Sinh nhật',
                cell: ({ row }) => row.original?.birthday ? formatDateToLocalDate(row.original.birthday) : 'Chưa cập nhật',
            },
            {
                accessorKey: 'address',
                header:'Địa chỉ',
                cell: ({ row }) => {
                    if (row.original.address) {
                        return row.original.address + ', ' + row.original.ward + ', ' + row.original.district + ', ' + row.original.city;
                    } else {
                        return 'Chưa cập nhật';
                    }
                },
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <EmployeeStatusBadge status={row.original.status} />,
                header: () => <span>Trạng thái</span>,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/employees/${row.original.id}`} />
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
        exportToExcel<EmployeeOverview>(employees, [], 'employees.xlsx');
    };


    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">

                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/employees/new'} />
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
                                    <Input name="search" placeholder="Mã hoặc tên nhân viên" />
                                    <Input name="country" placeholder="Số điện thoại" />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={[
                                                { label: 'Tất cả trạng thái', value: 'ALL' },
                                                ...Object.values(EmployeeStatus).map(value => ({
                                                    label: EmployeeStatusVietnamese[value],
                                                    value,
                                                }))
                                            ]}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<EmployeeOverview> data={employees} columns={columns} currentPage={currentPage}
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
                                  <>Bạn có chắc chắn muốn xóa nhân viên {deleteModal.selectedData?.firstName} {deleteModal.selectedData?.lastName} này không?</>
                              }
            />
        </>
    );
};

export default EmployeePage;