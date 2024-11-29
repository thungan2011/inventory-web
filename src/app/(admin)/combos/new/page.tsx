'use client';
import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { array, mixed, number, object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import UploadImage, { ImageFile } from '@/components/UploadImage';
import Select from '@/components/Select';
import { ProductStatus } from '@/modules/products/interface';
import Editor from '@/components/Editor';
import { ComboStatus } from '@/modules/combos/interface';
import { ComboStatusVietnamese } from '@/components/Badge/ComboStatusBadge';

const ProductSchema = object({
    code: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length !== 8) return this.createError({ message: 'Mã phải có đúng 8 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    name: string().required('Tên không được để trống'),
    category: string().required('Danh mục không được để trống'),
    origin: string().required('Nơi nhập khẩu không được để trống'),
    weight: number().required('Khối lượng không được để trống'),
    unit: string().required('Đơn vị không được để trống'),
    packing: string().required('Quy cách đóng gói không được để trống'),
    expiry: string().required('Hạn sử dụng không được để trống'),
    description: string().required('Mô tả không được để trống'),
    image: array().of(
        object().shape({
            path: string().required('Hình ảnh là bắt buộc'),
            file: mixed().optional(),
        }),
    ).min(1, 'Chọn ít nhất 1 ảnh sản phẩm').required('Chọn ít nhất 1 ảnh sản phẩm'),
});

interface FormValues {
    code?: string;
    name: string;
    category: string;
    origin: string;
    status: ProductStatus;
    weight: number;
    unit: string;
    packing: string;
    expiry: string;
    description: string;
    image: ImageFile[];
}

const initialFormValues: FormValues = {
    code: '',
    name: '',
    category: '',
    origin: '',
    status: ProductStatus.INACTIVE,
    weight: 0,
    unit: '',
    packing: '',
    expiry: '',
    description: '',
    image: [],
};

const NewProductPage = () => {

    useEffect(() => {
        document.title = 'Nut Garden - Thêm Combo';
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
                            <Typography.Title level={4}>Mã combo</Typography.Title>
                            <Input name="code" placeholder="Nếu không nhập mã combo, hệ thống sẽ tự động tạo" />
                        </Card>
                    </div>
                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="name" label="Tên combo" placeholder="Nhập tên combo" required />
                                <Select name="status" label="Trạng thái" disabled options={[
                                    ...Object.keys(ComboStatus).map(status => (
                                        { label: ComboStatusVietnamese[status as ComboStatus], value: status }
                                    )),
                                ]} />

                            </div>
                        </Card>
                    </div>
                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Thành phần</Typography.Title>
                            <p>
                                Bảng danh sách chi tiết các sản phẩm: id, sku, name, weight, packing, unit, price, note,
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

                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Mô tả</Typography.Title>
                            <Editor name="description" />
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/combos'}>
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