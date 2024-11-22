'use client';
import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
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
import { useRouter } from 'next/navigation';
import { useCreateCustomer } from '@/modules/customers/repository';
import { CustomerStatus } from '@/modules/customers/interface';
import { CustomerStatusVietnamese } from '@/components/Badge/CustomerStatusBadge';
import { useAddress } from '@/hook/useAddress';

const CustomerSchema = object({
    // code: string().test('valid-code', 'Mã không hợp lệ', function(value) {
    //     if (!value) return true;
    //     if (value.length < 4) return this.createError({ message: 'Mã tối thiểu 4 ký tự' });
    //     if (!/^[A-Z0-9]+$/.test(value)) return this.createError({ message: 'Mã phải chỉ chứa chữ in hoa và số' });
    //     return true;
    // }),
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
    address: string;
    ward: string;
    district: string;
    city: string;
    email?: string;
    status: CustomerStatus;
    note: string;
}

const initialFormValues: FormValues = {
    code: '',
    name: '',
    phone: '',
    birthday: new Date(),
    address: '',
    ward: '',
    district: '',
    city: '',
    email: '',
    status: CustomerStatus.INACTIVE,
    note: '',
};

const FormContent = ({isLoading} : {isLoading: boolean}) => {
    const { setFieldValue } = useFormikContext<FormValues>();

    const {
        provinceOptions,
        districtOptions,
        wardOptions,
        selectedProvinceName,
        selectedDistrictName,
        selectedWardName,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
    } = useAddress();

    useEffect(() => {
        setFieldValue('city', selectedProvinceName);
        setFieldValue('district', selectedDistrictName);
        setFieldValue('ward', selectedWardName);
    }, [selectedProvinceName, selectedDistrictName, selectedWardName, setFieldValue]);

    return (
        <Form>
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
                                        options={provinceOptions}
                                        onChange={handleProvinceChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <Select name="district" label="Quận/huyện"
                                        options={districtOptions}
                                        onChange={handleDistrictChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <Select name="ward" label="Xã/phường"
                                        options={wardOptions}
                                        onChange={handleWardChange}
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