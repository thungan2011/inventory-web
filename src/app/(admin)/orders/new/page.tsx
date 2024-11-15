'use client';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { number, object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import { OrderStatus } from '@/modules/orders/interface';
import InputCurrency from '@/components/InputCurrency';
import TextArea from '@/components/TextArea';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';
import Select, { SelectProps } from '@/components/Select';

const ProductSchema = object({
    code: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length !== 8) return this.createError({ message: 'Mã phải có đúng 8 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    nameCustomer: string().required('Tên khách hàng không được để trống'),
    receiverName: string().required('Tên người nhận không được để trống'),
    receiverPhone: string().required('Số điện thoại người nhận không được để trống'),
    receiverAddress: string().required('Địa chỉ nhận hàng không được để trống'),
    ward: string().required('Chọn Phường/xã'),
    district: string().required('Chọn Quận/huyện'),
    city: string().required('Chọn Tỉnh/thành phố'),
    shipping: number().required('Nhập phí vận chuyển'),
    vat: number().required('Nhập thuế Vat'),
});

interface FormValues {
    code?: string;
    nameCustomer: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    ward: string;
    district: string;
    city: string;
    shipping: number;
    vat: number;
    status: OrderStatus;
    note: string;
}

const initialFormValues: FormValues = {
    code: '',
    nameCustomer: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    ward: '',
    district: '',
    city: '',
    shipping: 0,
    vat: 10,
    status: OrderStatus.PROCESSED,
    note: '',
};

const DELIVERY_METHOD: SelectProps['options'] = [
    { label: 'Tự đến lấy', value: 'Tự đến lấy' },
    { label: 'Giao hàng tận nơi', value: 'Giao hàng tận nơi' },
];

const NewOrderPage = () => {
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>('');
    const { data: provinces } = useAllProvinces();
    const { data: districts } = useAllDistricts(selectedProvince);
    const { data: wards } = useAllWards(selectedDistrict);

    useEffect(() => {
        document.title = 'Nut Garden - Tạo đơn hàng';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="grid grid-cols-6 gap-x-3">
                        <div className={`col-span-4`}>
                            <Card className={`p-[18px]`}>
                                <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                    <Input name="nameCustomer" label="Tên khách hàng" placeholder="Chọn tên khách hàng"
                                           required />
                                    <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại" readOnly />
                                    <Input name="address" label="Địa chỉ" placeholder="Địa chỉ" readOnly />
                                    <Input name="email" label="Email" placeholder="Email" readOnly />
                                </div>
                            </Card>
                            <Card className={`p-[18px] mt-5`}>
                                <Typography.Title level={4}>Nhận hàng và vận chuyển</Typography.Title>
                                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                    <Select name="deliveryMethod"
                                            options={DELIVERY_METHOD}
                                            label="Hình thức nhận hàng"
                                            placeholder="Chọn hình thức nhận hàng"
                                    />
                                    <Input name="receiverName" label="Tên người nhận" placeholder="Nhập tên người nhận"
                                           required />
                                    <Input name="receiverPhone" label="Số điện thoại" placeholder="Nhập số điện thoại"
                                           required />
                                    <Input name="receiverAddress" label="Địa chỉ" placeholder="Nhập địa chỉ" required />
                                    <div className="grid grid-cols-3 gap-x-3">
                                        <div className="col-span-1">
                                            <Select name="city" label="Tỉnh/thành phố"
                                                    options={
                                                        provinces ? provinces.map(province => ({
                                                            label: province.province_name,
                                                            value: province.province_name,
                                                            id: province.province_id,
                                                        })) : []
                                                    }
                                                    onChange={(option) => {
                                                        setSelectedProvince(option.id);
                                                        setSelectedDistrict(undefined);
                                                    }}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Select name="district" label="Quận/huyện"
                                                    options={
                                                        districts ? districts.map(district => ({
                                                            label: district.district_name,
                                                            value: district.district_name,
                                                            id: district.district_id,
                                                        })) : []
                                                    }
                                                    onChange={(option) => setSelectedDistrict(option.id)}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Select name="ward" label="Xã/phường"
                                                    options={
                                                        selectedDistrict && wards ? wards.map(ward => ({
                                                            label: ward.ward_name,
                                                            value: ward.ward_name,
                                                        })) : []
                                                    }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card className={`p-[18px] col-span-3 mt-5`}>
                                <Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>
                                <p>
                                    Bảng danh sách chi tiết các sản phẩm: id, sku, name, weight, packing, unit,
                                    price, note,
                                    ...
                                </p>
                            </Card>
                            <Card className={`p-[18px] mt-5`}>
                                <Typography.Title level={4}>Hình thức thanh toán</Typography.Title>
                                <div
                                    className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 grid grid-cols-2 gap-x-3">
                                    <div className="col-span-1 mt-5">
                                        <Input name="paid" label="Đã thanh toán"
                                               placeholder="Chọn hình thức thanh toán: tiền mặt, CK, Momo" />
                                        <Input name="paid" label="Thanh toán sau"
                                               placeholder="Chọn hình thức thanh toán: tiền mặt, CK, Momo" />
                                    </div>
                                    <div className="col-span-1 mt-5">
                                        <InputCurrency name="paymentPrice" label="Số tiền nhận" unit="VND" />
                                        <InputCurrency name="paymentPrice" label="Số tiền nhận" unit="VND" />
                                    </div>
                                </div>
                            </Card>
                            <Card className={`p-[18px] mt-5`}>
                                <TextArea name="note" label="Ghi chú" />
                            </Card>
                        </div>
                        <Card className={`p-[18px] col-span-2`}>
                            <Typography.Title level={4}>Thanh toán</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 text-xs">
                                <InputCurrency name="totalPrice" label="Tổng tiền sản phẩm" unit="VND" readOnly />
                                <InputCurrency name="totalShipping" label="Phí vận chuyển" unit="VND"
                                               tooltip="Nếu bạn không nhập phí vận chuyển, hệ thống sẽ mặc định là 0 VND." />
                                <Input name="vat" label="Thuế GTGT" placeholder="Nhập thuế GTGT"
                                       tooltip="Nếu không nhập thuế GTGT sẽ tự động tính toán với tỷ lệ 10% trên tổng hóa đơn." />
                                <Input name="totalPayment" label="Thanh toán" placeholder="Thanh toán" readOnly />
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/orders'}>
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
export default NewOrderPage;