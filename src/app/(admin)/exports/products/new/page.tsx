'use client';
import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import TextArea from '@/components/TextArea';
import UploadImage from '@/components/UploadImage';
import { ExportProductStatus } from '@/modules/exports/products/interface';

const ProductSchema = object({
    code: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length !== 8) return this.createError({ message: 'Mã phải có đúng 8 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    receiverNam: string().required('Tên người nhận không được để trống'),
});

interface FormValues {
    code?: string;
    status: ExportProductStatus;
    receiverNam: string;
    note: string;
}

const initialFormValues: FormValues = {
    code: '',
    receiverNam: '',
    status: ExportProductStatus.COMPLETED,
    note: '',
};

const NewProductPage = () => {

    useEffect(() => {
        document.title = 'Nut Garden - Phiếu xuất';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Mã phiếu</Typography.Title>
                            <Input name="code" placeholder="Nếu không nhập mã phiếu, hệ thống sẽ tự động tạo" />
                        </Card>
                    </div>


                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>
                            <p>
                                Bảng danh sách chi tiết các nguyên vật liệu đã xuất: id, sku, name, weight, packing,
                                unit,
                                price, note,
                                ...
                            </p>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                <TextArea name="note" label="Ghi chú" />
                            </div>
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
                        <Link href={'/exports/materials'}>
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