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
import TextArea from '@/components/TextArea';
import DatePicker from '@/components/DatePicker';
import { GenderStatus, GenderStatusVietnamese } from '@/components/Badge/GenderStatusBadge';
import { useParams, useRouter } from 'next/navigation';
import { useCustomerByCode, useUpdateCustomer } from '@/modules/customers/repository';
import { CustomerStatus } from '@/modules/customers/interface';
import { CustomerStatusVietnamese } from '@/components/Badge/CustomerStatusBadge';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';

const CustomerSchema = object({
    name: string().required('Tên không được để trống'),
    phone: string().required('Số điện thoại không được để trống'),
    address: string().required('Địa chỉ không được để trống'),
    ward: string().required('Chọn Phường/xã'),
    district: string().required('Chọn Quận/huyện'),
    city: string().required('Chọn Tỉnh/thành phố'),
    birthday: string().nullable(),
});

interface FormValues {
    code?: string;
    name: string;
    phone: string;
    birthday?: Date;
    address?: string;
    ward?: string;
    district?: string;
    city?: string;
    email?: string;
    status: CustomerStatus;
    note: string;
}

const NewCustomerPage = () => {
    const router = useRouter();

    const [selectedProvince, setSelectedProvince] = useState<string | undefined>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>('');
    const { data: provinces } = useAllProvinces();
    const { data: districts } = useAllDistricts(selectedProvince);
    const { data: wards } = useAllWards(selectedDistrict);

    const { code } = useParams<{ code: string }>();
    const { data: customer, isLoading } = useCustomerByCode(code);
    const updateCustomer = useUpdateCustomer();

    useEffect(() => {
        document.title = 'Nut Garden - Thêm khách hàng';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!customer) {
        return <NotFound />;
    }

    const initialFormValues: FormValues = {
        code: customer.code,
        name: customer.name,
        phone: customer.phone,
        birthday: customer.birthday,
        address: customer.address,
        ward: customer.ward,
        district: customer.district,
        city: customer.city,
        email: customer.email,
        status: customer.status,
        note: customer.note || '',
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await updateCustomer.mutateAsync({
                id: customer.id,
                payload: {
                    ...values,
                },
            });
            router.push('/customers');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={CustomerSchema}>
                <Form>
                    <div className="mt-5">
                        <Card className="p-[18px]">
                            <div className="flex gap-1 text-xl font-nunito font-medium">
                                <div>Mã khách hàng</div>
                                <div className="text-brand-500">#{customer.code}</div>
                            </div>
                        </Card>
                    </div>
                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                <div className="grid grid-cols-2 gap-x-3">
                                    <div className="col-span-1">
                                        <Input name="name" label="Tên khách hàng" placeholder="Nhập tên khách hàng"
                                               required />
                                    </div>
                                    <div className="col-span-1">
                                        <Input name="email" label="Email" placeholder="Email" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-x-3">
                                    <div className="col-span-1">
                                        <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại"
                                               required />
                                    </div>
                                    <div className="col-span-1">
                                        <DatePicker name="birthday" label="Sinh nhật" maxDate={new Date()} />
                                    </div>
                                    <div className="col-span-1">
                                        <Select name="gender" label="Giới tính" options={[
                                            ...Object.keys(GenderStatus).map(status => (
                                                { label: GenderStatusVietnamese[status as GenderStatus], value: status }
                                            )),
                                        ]} />
                                    </div>
                                </div>
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
                                <Select name="status" label="Trạng thái" options={[
                                    ...Object.keys(CustomerStatus).map(status => (
                                        { label: CustomerStatusVietnamese[status as CustomerStatus], value: status }
                                    )),
                                ]} />
                                <TextArea name="note" label="Ghi chú" />
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/customers'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={updateCustomer.isPending}>
                            {updateCustomer.isPending ? 'Đang xử lý...' : 'Lưu'}
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewCustomerPage;