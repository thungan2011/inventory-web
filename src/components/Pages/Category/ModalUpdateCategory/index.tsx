import React from 'react';
import { Form, Formik } from 'formik';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import { string } from 'yup';
import Input from '@/components/Input';
import { CategoryOverview, CategoryType, CategoryTypeVietnamese } from '@/modules/categories/interface';
import TextArea from '@/components/TextArea';
import { useUpdateCategory } from '@/modules/categories/repository';

type ModalAddCategoryProps = {
    onClose: () => void;
    category: CategoryOverview | null;
}

interface FormValues {
    name: string;
    type: CategoryType;
    status: BaseStatus;
    description: string;
}

const validationSchema = Yup.object().shape({
    name: string().required('Tên không được để trống'),
});

const ModalUpdateCategory = ({ onClose, category }: ModalAddCategoryProps) => {

    const updateCategory = useUpdateCategory();


    if (!category) {
        return null;
    }

    const initialValues: FormValues = {
        name: category.name,
        type: category.type,
        status: category.status,
        description: category.description || '',
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updateCategory.mutateAsync({
                id: category.id,
                payload: {
                    ...values,
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const FormikContent = () => {
        return (
            <Form>
                <Input name="name" label="Tên danh mục" placeholder="Nhập tên danh mục" required />
                <Select name="status" label="Trạng thái"
                        options={[
                            { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                            { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                        ]} />
                <Select name="type" label="Loại"
                        options={[
                            { value: CategoryType.PRODUCT, label: CategoryTypeVietnamese[CategoryType.PRODUCT] },
                            { value: CategoryType.MATERIAL, label: CategoryTypeVietnamese[CategoryType.MATERIAL] },
                        ]} />
                <TextArea name="description" label="Mô tả" placeholder="Nhập mô tả ..." />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={updateCategory.isPending} />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Cập nhật danh mục" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateCategory;