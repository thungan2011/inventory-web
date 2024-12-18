'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import ButtonAction from '@/components/ButtonAction';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';
import { Form, Formik } from 'formik';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import WarehouseAreaListStatusBadge, {
    StorageAreaStatusVietnamese,
} from '../../../components/Badge/StorageAreaStatusBadge';
import { useAllStorageAreas, useDeleteStorageArea } from '@/modules/storage-area/repository';
import { StorageAreaOverview, StorageAreaStatus, StorageAreaType } from '@/modules/storage-area/interface';
import ModalAddStorageArea from '@/components/Pages/Storage-area/ModalAddStorageArea';
import ModalUpdateStorageArea from '@/components/Pages/Storage-area/ModalUpdateStorageArea';
import StorageAreaTypeBadge, { StorageAreaTypeVietnamese } from '@/components/Badge/StorageAreaTypeBadge';
import { SelectProps } from '@/components/Select';
import { ExcelColumn, exportToExcel } from '@/utils/exportToExcel';

interface StorageAreaFilter extends PaginationState {
    name: string;
    status: StorageAreaStatus | 'ALL';
    code: string;
    type: StorageAreaType | 'ALL';
}

const StorageAreaPage = () => {

    const [showModalAddStorageArea, setShowModalAddStorageArea] = useState<boolean>(false);

    const [filters, setFilters] = useState<StorageAreaFilter>({
        page: 1,
        name: '',
        status: 'ALL',
        code: '',
        type: 'ALL',
    });

    const exportColumns: ExcelColumn[] = [
        {
            field: 'code',
            header: 'Mã khu vực',
        },
        {
            field: 'name',
            header: 'Tên khu vực',
        },
        {
            field: 'type',
            header: 'Loại',
            formatter: (value: StorageAreaType) => StorageAreaTypeVietnamese[value],
        },
        {
            field: 'description',
            header: 'Mô tả',
        },
        {
            field: 'status',
            header: 'Trạng thái',
            formatter: (value: StorageAreaStatus) => StorageAreaStatusVietnamese[value],
        },
    ];

    const storageAreaQuery = useAllStorageAreas({
        page: filters.page,
        name: filters.name,
        code: filters.code,
        status: filters.status === 'ALL' ? undefined : filters.status,
        type: filters.type === 'ALL' ? undefined : filters.type,
    });

    const {
        data: storageAreas,
        currentPage,
        totalPages,
        isLoading,
        onFilterChange,
        onPageChange,
    } = useFilterPagination({
        queryResult: storageAreaQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteStorageArea = useDeleteStorageArea();
    const [storageAreaToUpdate, setStorageAreaToUpdate] = useState<StorageAreaOverview | null>(null);

    const deleteModal = useDeleteModal<StorageAreaOverview>({
        onDelete: async (data) => {
            await deleteStorageArea.mutateAsync(data.id);
        },
        canDelete: data => data.status !== StorageAreaStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa khu vực lưu kho đang hoạt động.',
        onSuccess: () => {
            setFilters(prevState => ({ ...prevState, page: 1 }));
            console.log('Thành công');
        },
    });

    useEffect(() => {
        document.title = 'Nut Garden - Khu vực lưu trữ';
    }, []);

    const columns = React.useMemo<ColumnDef<StorageAreaOverview>[]>(
        () => [
            {
                accessorKey: 'code',
                header: 'Mã khu vực',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.code}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Tên khu vực',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.name}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'type',
                header: () => <span>Loại</span>,
                cell: ({ row }) => <StorageAreaTypeBadge type={row.original.type} />,
            },
            {
                accessorKey: 'description',
                header: 'Mô tả',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div>{row.original.description}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: () => <span>Trạng thái</span>,
                cell: ({ row }) => <WarehouseAreaListStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/storage-area/${row.original.code}`} />
                        <ButtonAction.Update onClick={() => setStorageAreaToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [deleteModal],
    );

    const typeOptions: SelectProps['options'] = [
        { label: 'Tất cả loại', value: 'ALL' },
        ...Object.values(StorageAreaType).map(value => ({
            label: StorageAreaTypeVietnamese[value],
            value: value,
        })),
    ];

    const statusOptions: SelectProps['options'] = [
        { label: 'Tất cả trạng thái', value: 'ALL' },
        ...Object.values(StorageAreaStatus).map(value => ({
            label: StorageAreaStatusVietnamese[value],
            value,
        })),
    ];

    const handleExportExcel = async () => {
        await exportToExcel<StorageAreaOverview>(storageAreas, exportColumns, 'khu-vuc-luu-tru.xlsx');
    };

    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-end">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add onClick={() => setShowModalAddStorageArea(true)} />
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
                                    <Input name="code" placeholder="Mã khu vực lưu kho" />
                                    <Input name="name" placeholder="Tên khu vực lưu kho" />
                                    <Select name="type"
                                            placeholder="Lọc theo loại"
                                            options={typeOptions}
                                    />
                                    <Select name="status"
                                            placeholder="Lọc theo trạng thái"
                                            options={statusOptions}
                                    />
                                </div>
                            </div>
                            <AutoSubmitForm />
                        </Form>
                    </Formik>
                    <Table<StorageAreaOverview> data={storageAreas} columns={columns}
                                                currentPage={currentPage}
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
                                  <>Bạn có chắc chắn muốn xóa khu vực lưu trữ {deleteModal.selectedData?.name} này
                                      không?</>
                              }
            />

            <ModalAddStorageArea onClose={() => setShowModalAddStorageArea(false)} isOpen={showModalAddStorageArea} />
            <ModalUpdateStorageArea onClose={() => setStorageAreaToUpdate(null)} storageArea={storageAreaToUpdate} />

        </>
    );
};

export default StorageAreaPage;