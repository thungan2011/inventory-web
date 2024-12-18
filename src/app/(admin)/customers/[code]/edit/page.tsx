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
import Select from '@/components/Select';
import TextArea from '@/components/TextArea';
import DatePicker from '@/components/DatePicker';
import { useParams, useRouter } from 'next/navigation';
import { useCustomerByCode, useUpdateCustomer } from '@/modules/customers/repository';
import { CustomerOverview, CustomerStatus } from '@/modules/customers/interface';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import AddressForm from '@/components/AddressForm';
import dayjs from 'dayjs';
import { CustomerStatusVietnamese } from '@/components/Badge/CustomerStatusBadge';
import { Gender, GenderVietnamese, IAddressForm } from '@/modules/base/interface';
import { useGroupCustomerList } from '@/modules/group-customers/repository';

const CustomerSchema = object({
    name: string().required('Tên không được để trống'),
    phone: string().required('Số điện thoại không được để trống'),
    address: string().required('Địa chỉ không được để trống'),
    ward: string().required('Chọn Phường/xã'),
    district: string().required('Chọn Quận/huyện'),
    city: string().required('Chọn Tỉnh/thành phố'),
    birthday: string().nullable(),
});

interface FormValues extends IAddressForm {
    code?: string;
    name: string;
    phone: string;
    gender: Gender;
    birthday?: Date;
    email?: string;
    status: CustomerStatus;
    note: string;
    groupCustomer: number;
}

interface FormContentProps {
    customer: CustomerOverview;
    isLoading: boolean;
}

const FormContent = ({ isLoading, customer }: FormContentProps) => {
    const { data: groupCustomers } = useGroupCustomerList();

    return (
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
                        <Select name="groupCustomer" label="Nhóm khách hàng"  options={
                            (groupCustomers || []).map(groupCustomer => ({
                                label: groupCustomer.name,
                                value: groupCustomer.id,
                            }))
                        } />
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
                        <Select name="status" label="Trạng thái" options={[
                            ...Object.keys(CustomerStatus).map(status => (
                                { label: CustomerStatusVietnamese[status as CustomerStatus], value: status }
                            )),
                        ]} />
                        <TextArea name="note" label="Ghi chú" placeholder="Nhập ghi chú (nếu có)" />
                    </div>
                </Card>
            </div>

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/customers'}>
                    <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                        Hủy bỏ
                    </ButtonIcon>
                </Link>
                <ButtonIcon icon={<FaSave />} type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Lưu'}
                </ButtonIcon>
            </div>
        </Form>
    );
};

const NewCustomerPage = () => {
    const router = useRouter();

    const { code } = useParams<{ code: string }>();
    const { data: customer, isLoading } = useCustomerByCode(code);
    const updateCustomer = useUpdateCustomer();

    useEffect(() => {
        document.title = 'Nut Garden - Cập nhật khách hàng';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!customer) {
        return <NotFound />;
    }

    const initialFormValues: FormValues = {
        cityCode: customer.city ? customer.city.split(' - ')[1] : '',
        districtCode: customer.district ? customer.district.split(' - ')[1] : '',
        wardCode: customer.ward ? customer.ward.split(' - ')[1] : '',
        code: customer.code,
        name: customer.name,
        phone: customer.phone,
        birthday: dayjs(customer.birthday).toDate() || undefined,
        address: customer.address || '',
        ward: customer.ward ? customer.ward.split(' - ')[0] : '',
        district: customer.district ? customer.district.split(' - ')[0] : '',
        city: customer.city ? customer.city.split(' - ')[0] : '',
        email: customer.email,
        status: customer.status,
        note: customer.note || '',
        gender: customer.gender == 1 ? Gender.MALE : (customer.gender === 2 ? Gender.FEMALE : Gender.OTHER),
        groupCustomer: customer.groupCustomer.id
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await updateCustomer.mutateAsync({
                id: customer.id,
                payload: {
                    ...values,
                    birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined,
                    gender: values.gender === Gender.MALE ? 1 : values.gender === Gender.FEMALE ? 2 : 3,
                    city: `${values.city} - ${values.cityCode}`,
                    district: `${values.district} - ${values.districtCode}`,
                    ward: `${values.ward} - ${values.wardCode}`,
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
                <FormContent isLoading={updateCustomer.isPending} customer={customer} />
            </Formik>
        </div>
    );
};
export default NewCustomerPage;