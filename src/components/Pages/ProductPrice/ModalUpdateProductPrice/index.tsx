import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Modal';
import dayjs from 'dayjs';
import DatePicker from '@/components/DatePicker';
import Select from '@/components/Select';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import InputCurrency from '@/components/InputCurrency';
import { ProductPriceOverview, ProductPriceStatus } from '@/modules/product-price/interface';
import { ProductPriceStatusVietnamese } from '@/components/Badge/ProductPriceStatusBadge';
import { useUpdateProductPrice } from '@/modules/product-price/repository';

type ModalUpdateProductPriceProps = {
    onClose: () => void;
    productPrice: ProductPriceOverview | null;
}

interface FormValues {
    dateStart: Date;
    dateEnd: Date;
    status: ProductPriceStatus;
    price: number;
}

const validationSchema = Yup.object().shape({
    dateStart: Yup.date().required('Ngày bắt đầu không được để trống'),
    dateEnd: Yup.date()
        .required('Ngày kết thúc không được để trống')
        .min(Yup.ref('dateStart'), 'Ngày kết thúc phải sau ngày bắt đầu'),
    price: Yup.number().required('Giá không được để trống').min(0, 'Giá phải lớn hơn 0'),
});

const ModalUpdateProductPrice = ({ onClose, productPrice }: ModalUpdateProductPriceProps) => {
    /**
     * React query
     */
    const updateProductPrice = useUpdateProductPrice();

    if (!productPrice) return null;

    const initialValues: FormValues = {
        dateStart: dayjs(productPrice.dateStart).toDate(),
        dateEnd: dayjs(productPrice.dateEnd).toDate(),
        status: productPrice.status,
        price: productPrice.price,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            await updateProductPrice.mutateAsync({
                payload: {
                    dateStart: dayjs(values.dateStart).format('YYYY-MM-DD'),
                    dateEnd: dayjs(values.dateEnd).format('YYYY-MM-DD'),
                    status: values.status,
                    price: values.price,
                },
                id: productPrice.id,
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const FormikContent = () => {
        const { values, setFieldValue } = useFormikContext<FormValues>();
        useEffect(() => {
            if (dayjs(values.dateEnd).isBefore(dayjs(values.dateStart))) {
                setFieldValue('endDate', values.dateStart);
            }
        }, [values.dateStart, values.dateEnd, setFieldValue]);

        const isReadOnly = productPrice.status === ProductPriceStatus.ACTIVE;

        return (
            <Form>
                <DatePicker name="dateStart" label="Ngày bắt đầu" minDate={dayjs().toDate()} required
                            readOnly={isReadOnly} />
                <DatePicker name="dateEnd" label="Ngày kết thúc" minDate={dayjs().toDate()} required />
                <InputCurrency name="price" label="Giá" placeholder="Nhập giá" required unit="VND"
                               readOnly={isReadOnly} />
                <Select name="status" label="Trạng thái" readOnly={isReadOnly}
                        tooltip="Trạng thái mặc định khi tạo là `Không hoạt động`"
                        options={[
                            {
                                value: ProductPriceStatus.ACTIVE,
                                label: ProductPriceStatusVietnamese[ProductPriceStatus.ACTIVE],
                            },
                            {
                                value: ProductPriceStatus.INACTIVE,
                                label: ProductPriceStatusVietnamese[ProductPriceStatus.INACTIVE],
                            },
                        ]} />
                <div className="flex justify-end items-center gap-3">
                    <ButtonAction.Cancel onClick={onClose} />
                    <ButtonAction.Submit isLoading={updateProductPrice.isPending} />
                </div>
            </Form>
        );
    };
    return (
        <Modal title="Cập nhật bảng giá" open={true} onClose={onClose}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent />
            </Formik>
        </Modal>
    );
};

export default ModalUpdateProductPrice;