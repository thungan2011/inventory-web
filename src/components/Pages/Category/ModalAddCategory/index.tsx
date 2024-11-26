import React from 'react';
import { Form, Formik } from 'formik';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import { string } from 'yup';
import Input from '@/components/Input';
import { CategoryType, CategoryTypeVietnamese } from '@/modules/categories/interface';
import TextArea from '@/components/TextArea';
import { useCreateCategory } from '@/modules/categories/repository';

type ModalAddCategoryProps = {
    onClose: () => void;
    isOpen: boolean;
}

interface FormValues {
    name: string;
    type: CategoryType;
    status: BaseStatus;
    description: string;
}

const initialValues: FormValues = {
    name: '',
    type: CategoryType.PRODUCT,
    status: BaseStatus.INACTIVE,
    description: '',
};

const validationSchema = Yup.object().shape({
    name: string().trim().required('Tên không được để trống'),
});

const ModalAddCategory = ({ onClose, isOpen }: ModalAddCategoryProps) => {
    const createCategory = useCreateCategory();

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createCategory.mutateAsync({
                ...values,
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
                <Select name="type" label="Loại"
                        options={[
                            { value: CategoryType.PRODUCT, label: CategoryTypeVietnamese[CategoryType.PRODUCT] },
                            { value: CategoryType.MATERIAL, label: CategoryTypeVietnamese[CategoryType.MATERIAL] },
                        ]} />
                <Select name="status" label="Trạng thái"
                        options={[
                            { value: BaseStatus.ACTIVE, label: BaseStatusVietnamese[BaseStatus.ACTIVE] },
                            { value: BaseStatus.INACTIVE, label: BaseStatusVietnamese[BaseStatus.INACTIVE] },
                        ]} />
                <TextArea name="description" label="Mô tả" placeholder="Nhập mô tả ..." />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={createCategory.isPending} />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Thêm danh mục" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalAddCategory;