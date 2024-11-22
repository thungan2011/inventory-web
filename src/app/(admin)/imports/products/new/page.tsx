'use client';
import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Card from '@/components/Card';
import { object } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import Select from '@/components/Select';
import TextArea from '@/components/TextArea';
import UploadImage from '@/components/UploadImage';
import {
    ImportProductStatus,
    ImportProductStatusVietnamese,
    ImportProductType,
    ImportProductTypesVietnamese,
} from '@/modules/imports/products/interface';

const ProductSchema = object({});

interface FormValues {
    code?: string;
    status: ImportProductStatus;
    receiverNam: string;
    note: string;
    type: ImportProductType;
}

const initialFormValues: FormValues = {
    code: '',
    receiverNam: '',
    status: ImportProductStatus.COMPLETED,
    note: '',
    type: ImportProductType.NORMAL,
};

const NewProductPage = () => {

    useEffect(() => {
        document.title = 'Nut Garden - Tạo phiếu nhập';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <Card className={`p-[18px] mt-5`}>
                        <Typography.Title level={4}>Thông tin chung</Typography.Title>
                        <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                            <Select name="type" label="Loại giao dịch"
                                    options={[
                                        ...Object.keys(ImportProductType).map(type => (
                                            {
                                                label: ImportProductTypesVietnamese[type as ImportProductType],
                                                value: type,
                                            }
                                        )),
                                    ]} />
                            <Select name="status" label="Trạng thái"
                                    options={[
                                        ...Object.keys(ImportProductStatus).map(status => (
                                            {
                                                label: ImportProductStatusVietnamese[status as ImportProductStatus],
                                                value: status,
                                            }
                                        )),
                                    ]} />
                            <TextArea name="note" label="Ghi chú" />
                        </div>
                    </Card>

                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>
                            <p>
                                Bảng danh sách chi tiết các nguyên vật liệu: id, sku, name, weight, packing, unit,
                                price, note,
                                ...
                            </p>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <div>
                                <div>
                                    <UploadImage name="image" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/imports/products'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit">
                            Lưu
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewProductPage;