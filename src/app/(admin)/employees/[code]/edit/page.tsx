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
import Select, { SelectProps } from '@/components/Select';
import { BaseStatus, BaseStatusVietnamese, Gender, GenderVietnamese } from '@/modules/base/interface';
import DatePicker from '@/components/DatePicker';
import { EmployeeStatus } from '@/modules/employees/interface';
import UploadImage, { ImageFile } from '@/components/UploadImage';
import { useParams, useRouter } from 'next/navigation';
import { useEmployeeByCode, useUpdateEmployee } from '@/modules/employees/repository';
import dayjs from 'dayjs';
import AddressForm from '@/components/AddressForm';
import { useRoleList } from '@/modules/roles/repository';
import { formatRole } from '@/utils/formatString';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';

const EmployeeSchema = object({
    last_name: string()
        .trim()
        .required('Vui lòng nhập tên'),
    first_name: string()
        .trim()
        .required('Vui lòng nhập họ'),
    phone: string().trim()
        .min(10, 'Số điện thoại tối thiểu 10 ký tự')
        .max(10, 'Số điện thoại tối đa 10 ký tự')
        .required('Vui lòng nhập số điện thoại'),
    address: string().trim().required('Địa chỉ không được để trống'),
    ward: string().required('Chọn Phường/xã'),
    district: string().required('Chọn Quận/huyện'),
    city: string().required('Chọn Tỉnh/thành phố'),
    password: string().trim().required('Mật khẩu không đươc để trống'),
    email: string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

interface FormValues {
    last_name: string;
    first_name: string;
    phone: string;
    password: string;
    birthday?: Date;
    avatar?: ImageFile[];
    gender?: Gender;
    address: string;
    ward: string;
    wardCode: string;
    district: string;
    districtCode: string;
    city: string;
    cityCode: string;
    email: string;
    status: EmployeeStatus;
    role: number;
}

interface FormContentProps {
    isLoading: boolean;
}

interface FormContentProps {
    isLoading: boolean;
}

const FormContent = ({ isLoading }: FormContentProps) => {

    const { data: roles } = useRoleList();

    const statusOptions: SelectProps['options'] = [
        ...Object.keys(BaseStatus).map(status => (
            { label: BaseStatusVietnamese[status as BaseStatus], value: status }
        )),
    ];

    const roleOptions: SelectProps['options'] = (roles || []).map(role => ({
        label: formatRole(role.name),
        value: role.id,
    }));

    return (
        <Form>
            <div className="mt-5">
                <Card className={`p-[18px] col-span-3`}>
                    <Typography.Title level={4}>Tài khoản đăng nhập</Typography.Title>
                    <div className="grid grid-cols-2 gap-x-3">
                        <div className="col-span-1">
                            <Input name="email" label="Email" placeholder="Nhập Email" required />
                        </div>
                        <div className="col-span-1">
                            <div className="col-span-1">
                                <Input name="password" type="password" label="Mật khẩu" placeholder="Nhập mật khẩu"
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
                                <Input name="first_name" label="Họ đệm" placeholder="Nhập họ đệm"
                                       required />
                            </div>
                            <div className="col-span-1">
                                <Input name="last_name" label="Tên" placeholder="Nhập tên" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-3">
                            <div className="col-span-1">
                                <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại"
                                       required />
                            </div>
                            <div className="col-span-1">
                                <DatePicker name="birthday" label="Sinh nhật"
                                            maxDate={dayjs().add(-1, 'day').toDate()} />
                            </div>
                            <div className="col-span-1">
                                <Select name="gender" label="Giới tính" options={
                                    Object.values(Gender).map(gender => ({
                                        label: GenderVietnamese[gender],
                                        value: gender,
                                    }))
                                } />
                            </div>
                        </div>
                        <Input name="address" label="Địa chỉ" placeholder="Địa chỉ" required />
                        <AddressForm />
                        <div className="grid grid-cols-2 gap-3">
                            <Select name="role"
                                    disabled
                                    required
                                    label="Chức vụ"
                                    options={roleOptions}
                            />
                            <Select name="status"
                                    label="Trạng thái"
                                    disabled
                                    options={statusOptions}
                            />
                        </div>
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
                <Link href={'/employees'}>
                    <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                        Hủy bỏ
                    </ButtonIcon>
                </Link>
                <ButtonIcon icon={<FaSave />} type="submit">
                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </ButtonIcon>
            </div>
        </Form>
    );
};

const UpdateEmployeePage = () => {
    const router = useRouter();

    const { code } = useParams<{ code: string }>();
    const { data: employee, isLoading } = useEmployeeByCode(code);
    const updateEmployee = useUpdateEmployee();


    useEffect(() => {
        document.title = 'Nut Garden - Cập nhật nhân viên';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!employee) {
        return <NotFound />;
    }

    const initialFormValues: FormValues = {
        last_name: employee.lastName,
        first_name: employee.firstName,
        phone: employee.phone,
        password: '',
        birthday: dayjs(employee.birthday).toDate() || undefined,
        avatar: [],
        gender: employee.gender == 1 ? Gender.MALE : (employee.gender === 2 ? Gender.FEMALE : Gender.OTHER),
        ward: employee.ward ? employee.ward.split(' - ')[0] : '',
        wardCode: employee.ward ? employee.ward.split(' - ')[1] : '',
        district: employee.district ? employee.district.split(' - ')[0] : '',
        districtCode: employee.district ? employee.district.split(' - ')[1] : '',
        address: employee.address,
        city: employee.city ? employee.city.split(' - ')[0] : '',
        cityCode: employee.city ? employee.city.split(' - ')[1] : '',
        email: employee.user.email,
        role: employee.user.roleId,
        status: employee.status,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await updateEmployee.mutateAsync({
                id: employee.id,
                payload: {
                    ...values,
                    avatar: 'h.jpg',
                    birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined,
                    gender: values.gender === Gender.MALE ? 1 : values.gender === Gender.FEMALE ? 2 : 3,
                    role_id: values.role,
                    city: `${values.city} - ${values.cityCode}`,
                    district: `${values.district} - ${values.districtCode}`,
                    ward: `${values.ward} - ${values.wardCode}`,
                },
            });
            router.push('/employees');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={EmployeeSchema}>
                <FormContent isLoading={updateEmployee.isPending} />
            </Formik>
        </div>
    );
};
export default UpdateEmployeePage;