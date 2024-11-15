'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import BaseStatusBadge from '@/components/Badge/BaseStatusBadge';
import { CategoryOverview, CategoryType, CategoryTypeVietnamese } from '@/modules/categories/interface';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { useAllCategories, useDeleteCategory } from '@/modules/categories/repository';
import ButtonAction from '@/components/ButtonAction';
import Typography from '@/components/Typography';
import Input from '@/components/Filters/Input';
import Select from '@/components/Filters/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';
import { Form, Formik } from 'formik';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import useDeleteModal from '@/hook/useDeleteModal';
import ModalDeleteAlert from '@/components/ModalDeleteAlert';
import CategoryTypeBadge from '@/components/Badge/CategoryTypeBadge';
import ModalAddCategory from '@/components/Pages/Category/ModalAddCategory';
import ModalUpdateCategory from '@/components/Pages/Category/ModalUpdateCategory';

interface CategoryFilter extends PaginationState {
    name: string;
    code: string;
    status: BaseStatus | 'ALL';
    type: CategoryType | 'ALL';
}

const CategoryPage = () => {

    const [showModalAddCategory, setShowModalAddCategory] = useState<boolean>(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<CategoryOverview | null>(null);

    useEffect(() => {
        document.title = 'Nut Garden - Danh mục';
    }, []);

    const [filters, setFilters] = useState<CategoryFilter>({
        page: 1,
        name: '',
        code: '',
        status: 'ALL',
        type: 'ALL',
    });

    const categoryQuery = useAllCategories({
        page: filters.page,
        name: filters.name,
        code: filters.code,
        status: filters.status === 'ALL' ? undefined : filters.status,
        type: filters.type === 'ALL' ? undefined : filters.type,
    });
    const deleteCategory = useDeleteCategory();

    const {
        data: categories,
        currentPage,
        totalPages,
        onFilterChange,
        isLoading,
        onPageChange,
    } = useFilterPagination({
        queryResult: categoryQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    const deleteModal = useDeleteModal<CategoryOverview>({
        onDelete: async (data) => {
            await deleteCategory.mutateAsync(data.id);
        },
        canDelete: data => data.status !== BaseStatus.ACTIVE,
        unableDeleteMessage: 'Không thể xóa danh mục đang hoạt động',
        onSuccess: () => {
            setFilters(prevState => ({ ...prevState, page: 1 }));
        },
    });


    const columns = React.useMemo<ColumnDef<CategoryOverview>[]>(
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
                header: 'Tên danh mục',
                cell: ({ row }) => (
                    <div className="text-nowrap">{row.original.name}</div>
                )
            },
            {
                id: 'quantity',
                cell: ({ row }) => row.original.type === CategoryType.MATERIAL ? row.original.totalMaterial : row.original.totalProduct,
                header: 'Số lượng',
            },
            {
                accessorKey: 'type',
                cell: ({ row }) => <CategoryTypeBadge type={row.original.type} />,
                header: 'Loại',
            },
            {
                accessorKey: 'description',
                header: 'Mô tả',
                cell: ({ row }) => (
                    <div className="w-72 max-w-72 line-clamp-2">
                        {row.original.description}
                    </div>
                )
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <BaseStatusBadge status={row.original.status} />,
                header: 'Trạng thái',
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.Update onClick={() => setCategoryToUpdate(row.original)} />
                        <ButtonAction.Delete onClick={() => deleteModal.openDeleteModal(row.original)} />
                    </div>
                ),
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
                            <ButtonAction.Add onClick={() => setShowModalAddCategory(true)} />
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
                                    <Input name="code" placeholder="Mã danh mục" />
                                    <Input name="name" placeholder="Tên danh mục" />
                                    <Select name="type"
                                            placeholder="Lọc theo loại"
                                            options={[
                                                { label: 'Tất cả loại', value: 'ALL' },
                                                ...Object.values(CategoryType).map(value => ({
                                                    label: CategoryTypeVietnamese[value],
                                                    value,
                                                })),
                                            ]}
                                    />
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
                    <Table<CategoryOverview> data={categories} columns={columns} currentPage={currentPage}
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
                                  <>Bạn có chắc chắn muốn xóa danh mục {deleteModal.selectedData?.name} này không?</>
                              }
            />

            <ModalAddCategory onClose={() => setShowModalAddCategory(false)} isOpen={showModalAddCategory} />
            <ModalUpdateCategory onClose={() => setCategoryToUpdate(null)} category={categoryToUpdate} />
        </>
    );
};

export default CategoryPage;