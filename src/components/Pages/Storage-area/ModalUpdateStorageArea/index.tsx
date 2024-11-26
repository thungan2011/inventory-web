import React from 'react';
import { Form, Formik } from 'formik';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import { string } from 'yup';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { StorageAreaOverview, StorageAreaStatus, StorageAreaType } from '@/modules/storage-area/interface';
import { useUpdateStorageArea } from '@/modules/storage-area/repository';
import { StorageAreaStatusVietnamese } from '@/components/Badge/StorageAreaStatusBadge';
import { StorageAreaTypeVietnamese } from '@/components/Badge/StorageAreaTypeBadge';

type ModalAddStorageAreaProps = {
    onClose: () => void;
    storageArea: StorageAreaOverview | null;
}

interface FormValues {
    name: string;
    code: string;
    type: StorageAreaType;
    status: StorageAreaStatus;
    description: string;
}

const validationSchema = Yup.object().shape({
    name: string().required('Tên không được để trống'),
    type: string().required('Chọn loại lưu kho'),
});

const ModalUpdateStorageArea = ({ onClose, storageArea }: ModalAddStorageAreaProps) => {

    const updateStorageArea = useUpdateStorageArea();


    if (!storageArea) {
        return null;
    }

    const initialValues: FormValues = {
        name: storageArea.name,
        code: storageArea.code,
        status: storageArea.status,
        type: storageArea.type,
        description: storageArea.description || '',
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updateStorageArea.mutateAsync({
                id: storageArea.id,
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
                <Input name="code" label="Mã khu vực lưu kho" readOnly
                       placeholder="Nếu không nhập mã khu vực lưu kho, hệ thống sẽ tự động tạo" />
                <Input name="name" label="Tên khu vực lưu kho" placeholder="Nhập khu vực lưu kho" required />
                <Select name="type" label="Loại" required
                        options={[
                            {
                                value: StorageAreaType.PRODUCT,
                                label: StorageAreaTypeVietnamese[StorageAreaType.PRODUCT],
                            },
                            {
                                value: StorageAreaType.MATERIAL,
                                label: StorageAreaTypeVietnamese[StorageAreaType.MATERIAL],
                            },
                        ]} />
                <Select name="status" label="Trạng thái"
                        options={[
                            {
                                value: StorageAreaStatus.ACTIVE,
                                label: StorageAreaStatusVietnamese[StorageAreaStatus.ACTIVE],
                            },
                            {
                                value: StorageAreaStatus.INACTIVE,
                                label: StorageAreaStatusVietnamese[StorageAreaStatus.INACTIVE],
                            },
                        ]} />
                <TextArea name="description" label="Mô tả" />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={updateStorageArea.isPending} />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Cập nhật khu vực lưu kho" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateStorageArea;