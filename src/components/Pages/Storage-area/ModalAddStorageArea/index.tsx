import React from 'react';
import { Form, Formik } from 'formik';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import { BaseStatusVietnamese } from '@/modules/base/interface';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import { string } from 'yup';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { StorageAreaStatus } from '@/modules/storage-area/interface';
import { useCreateStorageArea } from '@/modules/storage-area/repository';

type ModalAddStorageAreaProps = {
    onClose: () => void;
    isOpen: boolean;
}

interface FormValues {
    name: string;
    code: string;
    status: StorageAreaStatus;
    description: string;
}

const initialValues: FormValues = {
    name: '',
    code: '',
    status: StorageAreaStatus.INACTIVE,
    description: '',
};

const validationSchema = Yup.object().shape({
    sku: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length < 4) return this.createError({ message: 'Mã phải có ít nhất 4 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    name: string().required('Tên không được để trống'),
});

const ModalAddStorageArea = ({ onClose, isOpen }: ModalAddStorageAreaProps) => {
    const createStorageArea = useCreateStorageArea();

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createStorageArea.mutateAsync({
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
                <Input name="code" label="Mã khu vực lưu kho"
                       placeholder="Nếu không nhập mã khu vực lưu kho, hệ thống sẽ tự động tạo" />
                <Input name="name" label="Tên khu vực lưu kho" placeholder="Nhập khu vực lưu kho" required />
                <Select name="status" label="Trạng thái"
                        options={[
                            { value: StorageAreaStatus.ACTIVE, label: BaseStatusVietnamese[StorageAreaStatus.ACTIVE] },
                            {
                                value: StorageAreaStatus.INACTIVE,
                                label: BaseStatusVietnamese[StorageAreaStatus.INACTIVE],
                            },
                        ]} />
                <TextArea name="description" label="Mô tả" />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={createStorageArea.isPending} />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Thêm khu vực lưu kho" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalAddStorageArea;