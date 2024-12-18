import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Modal from '@/components/Modal';
import dayjs from 'dayjs';
import DatePicker from '@/components/DatePicker';
import Select from '@/components/Select';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import TextArea from '@/components/TextArea';
import { useAllStorageAreas } from '@/modules/storage-area/repository';
import { StorageAreaType } from '@/modules/storage-area/interface';
import { useCreateInventoryCheck } from '@/modules/inventory-checks/repository';

type ModalAddInventoryCheckProps = {
    onClose: () => void;
}

interface FormValues {
    storageAreaId: number;
    checkDate: Date;
    note: string;
}

const validationSchema = Yup.object().shape({});

interface FormContentProps {
    isLoading: boolean;
    onClose: () => void;
}

const FormContent = ({ isLoading, onClose }: FormContentProps) => {
    const [storageAreaSearchTerm, setStorageAreaSearchTerm] = useState<string>('');

    const storageAreaQuery = useAllStorageAreas({
        name: storageAreaSearchTerm,
    });

    return (
        <Form>
            <Select name="storageAreaId"
                    required
                    enableSearch
                    searchPlaceholder="Tìm kiếm theo tên"
                    onSearch={setStorageAreaSearchTerm}
                    label="Khu vực kiểm kê"
                    options={[
                        ...(storageAreaQuery.data?.data || []).map(area => ({
                            label: `${area.code} - ${area.name} - ${area.type === StorageAreaType.PRODUCT ? 'Kho sản phẩm' : 'Kho nguyên vật liệu'}`,
                            value: area.id,
                        })),
                    ]}
            />
            <DatePicker name="checkDate"
                        label="Ngày kiểm dự kiến"
                        minDate={dayjs().toDate()}
                        required
            />
            <TextArea name="note"
                      placeholder="Nhập ghi chú (nếu có)"
                      label="Ghi chú"
            />
            <div className="flex justify-end items-center gap-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit isLoading={isLoading} />
            </div>
        </Form>
    );
};

const ModalAddInventoryCheck = ({ onClose }: ModalAddInventoryCheckProps) => {
    /**
     * React query
     */
    const createInventoryCheckMutation = useCreateInventoryCheck();

    const initialValues: FormValues = {
        storageAreaId: 0,
        checkDate: dayjs().toDate(),
        note: '',
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await createInventoryCheckMutation.mutateAsync({
                storage_area_id: values.storageAreaId,
                check_date: dayjs(values.checkDate).format('YYYY-MM-DD'),
                note: values.note,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Tạo yêu cầu kiểm kê" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormContent isLoading={false} onClose={onClose} />
            </Formik>
        </Modal>
    );
};

export default ModalAddInventoryCheck;