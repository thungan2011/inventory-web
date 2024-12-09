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
import { BaseStatus, BaseStatusVietnamese, IAddressForm } from '@/modules/base/interface';
import TextArea from '@/components/TextArea';
import { useCreateProvider } from '@/modules/providers/repository';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/AddressForm';

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

interface FormValues extends IAddressForm{
    name: string;
    phone: string;
    website?: string;
    email?: string;
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
    wardCode: '',
    district: '',
    districtCode: '',
    city: '',
    cityCode: '',
    email: '',
    website: '',
    representative_name: '',
    representative_phone: '',
    representative_email: '',
    status: BaseStatus.INACTIVE,
    note: '',
};

interface FormContentProps {
    isLoading: boolean;
}

const FormContent = ({ isLoading }: FormContentProps) => {
    return (
        <Form>
            <div className="grid grid-cols-6 gap-x-3 mt-5">
                <Card className={`p-[18px] col-span-4`}>
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                        <Input name="name" label="Tên nhà cung cấp" placeholder="Nhâp tên nhà cung cấp"
                               required />
                        <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại" required />
                        <Input name="address" label="Địa chỉ" placeholder="Địa chỉ" required />
                        <AddressForm />
                        <Input name="email" label="Email" placeholder="Nhập Email nhà cung cấp" />
                        <Input name="website" label="Website" placeholder="Nhập Website nhà cung cấp" />
                        <Select name="status" label="Trạng thái" options={[
                            ...Object.keys(BaseStatus).map(status => (
                                { label: BaseStatusVietnamese[status as BaseStatus], value: status }
                            )),
                        ]} />
                    </div>
                </Card>

                <Card className={`p-[18px] col-span-2`}>
                    <Typography.Title level={4}>Thông tin người liên hệ</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                        <Input name="representative_name" label="Tên người liên hệ"
                               placeholder="Nhập tên người liên hệ"
                               required />
                        <Input name="representative_phone" label="Số điện thoại" placeholder="Số điện thoại"
                               required />
                        <Input name="representative_email" label="Email" placeholder="Email" />
                        <TextArea name="note" label="Ghi chú" placeholder="Nhập ghi chú (nếu có)"/>
                    </div>
                </Card>
            </div>

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/providers'}>
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

const NewProviderPage = () => {
    const router = useRouter();
    const createProvider = useCreateProvider();

    useEffect(() => {
        document.title = 'Nut Garden - Thêm nhà cung cấp';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        try {
            await createProvider.mutateAsync({
                ...values,
                city: `${values.city} - ${values.cityCode}`,
                district: `${values.district} - ${values.districtCode}`,
                ward: `${values.ward} - ${values.wardCode}`,
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
                <FormContent isLoading={createProvider.isPending} />
            </Formik>
        </div>
    );
};
export default NewProviderPage;