'use client';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import Select from '@/components/Select';
import { BaseStatus, BaseStatusVietnamese } from '@/modules/base/interface';
import TextArea from '@/components/TextArea';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';
import { useCreateProvider } from '@/modules/providers/repository';
import { useRouter } from 'next/navigation';

const ProductSchema = object({
    name: string().required('Tên không được để trống'),
    phone: string().required('Số điện thoại không được để trống'),
    address: string().required('Địa chỉ không được để trống'),
    ward: string().required('Chọn Phường/xã'),
    district: string().required('Chọn Quận/huyện'),
    city: string().required('Chọn Tỉnh/thành phố'),
    representative_name: string().required('Tên người liên hệ không được để trống'),
    representative_phone: string().required('Số điện thoại người liên hệ không được để trống'),
});

interface FormValues {
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    website?: string;
    email?:string;
    representative_name: string;
    representative_phone: string;
    representative_email?: string;
    status: BaseStatus;
    note: string;
}

const initialFormValues: FormValues = {
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    email: '',
    website: '',
    representative_name: '',
    representative_phone: '',
    representative_email: '',
    status: BaseStatus.INACTIVE,
    note: '',
};

const NewProviderPage = () => {
    const router = useRouter();
    const createProvider = useCreateProvider();

    const [selectedProvince, setSelectedProvince] = useState<string | undefined>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>('');
    const { data: provinces } = useAllProvinces();
    const { data: districts } = useAllDistricts(selectedProvince);
    const { data: wards } = useAllWards(selectedDistrict);

    useEffect(() => {
        document.title = 'Nut Garden - Thêm nhà cung cấp';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await createProvider.mutateAsync({
                ...values,
            });
            router.push('/providers');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="grid grid-cols-6 gap-x-3 mt-5">
                        <Card className={`p-[18px] col-span-4`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                <Input name="name" label="Tên nhà cung cấp" placeholder="Nhâp tên nhà cung cấp"
                                       required />
                                <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại" required />
                                <Input name="address" label="Địa chỉ" placeholder="Địa chỉ" required />
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
                                <Input name="email" label="Email" placeholder="Nhập Email nhà cung cấp" />
                                <Input name="website" label="Website" placeholder="Nhập Website nhà cung cấp" />
                                <Select name="status" label="Trạng thái" readOnly options={[
                                    ...Object.keys(BaseStatus).map(status => (
                                        { label: BaseStatusVietnamese[status as BaseStatus], value: status }
                                    )),
                                ]} />
                            </div>
                        </Card>

                        <Card className={`p-[18px] col-span-2`}>
                            <Typography.Title level={4}>Thông tin người liên hệ</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                <Input name="representative_name" label="Tên người liên hệ" placeholder="Nhập tên người liên hệ"
                                       required />
                                <Input name="representative_phone" label="Số điện thoại" placeholder="Số điện thoại" required/>
                                <Input name="representative_email" label="Email" placeholder="Email" />
                                <TextArea name="note" label="Ghi chú" />
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>
                            <p>
                                Bảng danh sách các mặt hàng nguyên vật liệu nhà cung cấp cung cấp: id, sku, name,
                                weight, packing, unit, price, note,
                                ...
                            </p>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/providers'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={createProvider.isPending}>
                            {createProvider.isPending ? 'Đang xử lý...' : 'Lưu'}
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewProviderPage;