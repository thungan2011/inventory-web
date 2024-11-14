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
import DatePicker from '@/components/DatePicker';
import { EmployeeStatus } from '@/modules/employees/interface';
import UploadImage, { ImageFile } from '@/components/UploadImage';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';
import { useRouter } from 'next/navigation';
import { useCreateEmployee } from '@/modules/employees/repository';
import dayjs from 'dayjs';

const ProductSchema = object({
    user_id: string().test('valid-code', 'Mã không hợp lệ', function(value) {
        if (!value) return true;
        if (value.length < 4) return this.createError({ message: 'Mã tối thiểu 4 ký tự' });
        if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
        return true;
    }),
    last_name: string().required('Tên không được để trống'),
    first_name: string().required('Tên không được để trống'),
    phone: string().required('Số điện thoại không được để trống'),
    address: string().required('Địa chỉ không được để trống'),
    ward: string().required('Chọn Phường/xã'),
    district: string().required('Chọn Quận/huyện'),
    city: string().required('Chọn Tỉnh/thành phố'),
    password: string().required('Mật khẩu không đươc để trống'),
    email: string().required('Email không đươc để trống'),
});

interface FormValues {
    user_id?: string;
    last_name: string;
    first_name: string;
    phone: string;
    password: string;
    birthday?: Date;
    avatar?: ImageFile[];
    gender?: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    email: string;
    status: EmployeeStatus;
}

const initialFormValues: FormValues = {
    user_id: '',
    last_name: '',
    first_name: '',
    phone: '',
    password: '',
    birthday: new Date(),
    avatar: [],
    gender: '1',
    ward: '',
    district: '',
    address: '',
    city: '',
    email: '',
    status: EmployeeStatus.ACTIVE,
};

const NewEmployeePage = () => {
    const router = useRouter();
    const createEmployee = useCreateEmployee();

    const [selectedProvince, setSelectedProvince] = useState<string | undefined>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>('');
    const { data: provinces } = useAllProvinces();
    const { data: districts } = useAllDistricts(selectedProvince);
    const { data: wards } = useAllWards(selectedDistrict);

    useEffect(() => {
        document.title = 'Nut Garden - Thêm nhân viên';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await createEmployee.mutateAsync({
                ...values,
                avatar: 'h.jpg',
                birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined,
                gender: Number(values.gender),
            });
            router.push('/profiles');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Mã nhân viên</Typography.Title>
                            <Input name="user_id" placeholder="Nếu không nhập mã nhân viên, hệ thống sẽ tự động tạo" />
                        </Card>
                    </div>
                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Tài khoản đăng nhập</Typography.Title>
                            <div className="grid grid-cols-2 gap-x-3">
                                <div className="col-span-1">
                                    <Input name="email" label="Email" placeholder="Nhập Email" required />
                                </div>
                                <div className="col-span-1">
                                    <div className="col-span-1">
                                        <Input name="password" label="Mật khẩu" placeholder="Nhập mật khẩu"
                                               required />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="grid grid-cols-6 gap-x-3">
                        <Card className={`p-[18px] col-span-4 mt-5`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                <div className="grid grid-cols-2 gap-x-3">
                                    <div className="col-span-1">
                                        <Input name="last_name" label="Họ đệm" placeholder="Nhập họ đệm"
                                               required />
                                    </div>
                                    <div className="col-span-1">
                                        <Input name="first_name" label="Tên" placeholder="Nhập tên" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-x-3">
                                    <div className="col-span-1">
                                        <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại"
                                               required />
                                    </div>
                                    <div className="col-span-1">
                                        <DatePicker name="birthday" label="Sinh nhật" />
                                    </div>
                                    <div className="col-span-1">
                                        <Select name="gender" label="Giới tính" options={[
                                            { value: '1', label: 'Nam' },
                                            { value: '0', label: 'Nữ' },
                                            { value: '2', label: 'Khác' },
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
                                <Select name="status" label="Trạng thái" readOnly options={[
                                    ...Object.keys(BaseStatus).map(status => (
                                        { label: BaseStatusVietnamese[status as BaseStatus], value: status }
                                    )),
                                ]} />
                            </div>
                        </Card>
                        <Card className={`p-[18px] mt-5 col-span-2`}>
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <div>
                                <div>
                                    <UploadImage name="image" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/customers'}>
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
export default NewEmployeePage;