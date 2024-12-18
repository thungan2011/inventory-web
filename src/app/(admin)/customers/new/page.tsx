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
import { useRouter } from 'next/navigation';
import { useCreateCustomer } from '@/modules/customers/repository';
import { CustomerStatus } from '@/modules/customers/interface';
import { CustomerStatusVietnamese } from '@/components/Badge/CustomerStatusBadge';
import AddressForm from '@/components/AddressForm';
import { Gender, GenderVietnamese, IAddressForm } from '@/modules/base/interface';
import { useGroupCustomerList } from '@/modules/group-customers/repository';
import dayjs from 'dayjs';

const CustomerSchema = object({
    name: string().trim().required('Tên không được để trống'),
    phone: string().trim().required('Số điện thoại không được để trống'),
    address: string().trim().required('Địa chỉ không được để trống'),
    ward: string().trim().required('Chọn Phường/xã'),
    district: string().trim().required('Chọn Quận/huyện'),
    city: string().trim().required('Chọn Tỉnh/thành phố'),
    birthday: string().trim().nullable(),
});

interface FormValues extends IAddressForm{
    code?: string;
    name: string;
    phone: string;
    birthday?: Date;
    email?: string;
    gender: Gender;
    status: CustomerStatus;
    note: string;
    groupCustomer: number;
}

const initialFormValues: FormValues = {
    code: '',
    name: '',
    phone: '',
    birthday: new Date(),
    address: '',
    ward: '',
    wardCode: '',
    district: '',
    districtCode: '',
    gender: Gender.MALE,
    city: '',
    cityCode: '',
    email: '',
    status: CustomerStatus.INACTIVE,
    note: '',
    groupCustomer: 0,
};

interface FormContentProps {
    isLoading: boolean;
}

const FormContent = ({ isLoading }: FormContentProps) => {
    const { data: groupCustomers } = useGroupCustomerList();

    return (
        <Form>
            <div className="mt-5">
                <Card className={`p-[18px]`}>
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                        <Select name="groupCustomer" label="Nhóm khách hàng" options={
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
    const createCustomer = useCreateCustomer();

    useEffect(() => {
        document.title = 'Nut Garden - Thêm khách hàng';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await createCustomer.mutateAsync({
                ...values,
                birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined,
                group_customer_id: values.groupCustomer,
                gender: values.gender === Gender.MALE ? 1 : values.gender === Gender.FEMALE ? 2 : 3,
                city: `${values.city} - ${values.cityCode}`,
                district: `${values.district} - ${values.districtCode}`,
                ward: `${values.ward} - ${values.wardCode}`,

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
                <FormContent isLoading={createCustomer.isPending} />
            </Formik>
        </div>
    );
};
export default NewCustomerPage;