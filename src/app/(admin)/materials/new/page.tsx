'use client';
import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { array, number, object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import Select from '@/components/Select';
import TextArea from '@/components/TextArea';
import { MaterialStatus } from '@/modules/materials/interface';
import { useRouter } from 'next/navigation';
import { useCreateMaterial } from '@/modules/materials/repository';
import { useCategoryList } from '@/modules/categories/repository';
import Loader from '@/components/Loader';
import { CategoryType } from '@/modules/categories/interface';
import { MaterialStatusVietnamese } from '@/components/Badge/MaterialStatusBadge';

const ProductSchema = object({
    name: string().trim().required('Tên không được để trống'),
    categories: array().required('Chọn danh mục').min(1, 'Chọn tối thiểu 1 danh mục'),
    origin: string().trim().required('Nơi nhập khẩu không được để trống'),
    weight: number().required('Khối lượng không được để trống'),
    unit: string().trim().required('Đơn vị không được để trống'),
    packing: string().trim().required('Quy cách đóng gói không được để trống'),
});

interface FormValues {
    sku?: string;
    name: string;
    categories: number[];
    origin: string;
    status: MaterialStatus;
    weight: number;
    unit: string;
    packing: string;
    note?: string;
    minimum_stock_level?: number;
    maximum_stock_level?: number;
}

const initialFormValues: FormValues = {
    sku: '',
    name: '',
    categories: [],
    origin: '',
    status: MaterialStatus.INACTIVE,
    weight: 0,
    unit: '',
    packing: '',
    note: '',
    minimum_stock_level: 0,
    maximum_stock_level: 0,
};

const NewMaterialPage = () => {
    const router = useRouter();
    const createMaterial = useCreateMaterial();
    const { data: categories, isLoading: isCategoriesLoading } = useCategoryList(CategoryType.MATERIAL);


    useEffect(() => {
        document.title = 'Nut Garden - Thêm nguyên vật liệu';
    }, []);

    if (isCategoriesLoading) {
        return <Loader />;
    }

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await createMaterial.mutateAsync({
                ...values,
                category_id: values.categories,
                minimum_stock_level: values?.minimum_stock_level ? values.minimum_stock_level : 0,
            });
            router.push('/materials');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="grid grid-cols-2 gap-x-3 mt-5">
                        <Card className={`p-[18px] col-span-1`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="name" label="Tên nguyên vật liệu" placeholder="Nhập tên nguyên vật liệu"
                                       required />
                                <Select name="categories" label="Danh mục" multiple options={
                                    categories ? categories.map(category => ({
                                        label: category.name,
                                        value: category.id,
                                    })) : []
                                } />
                                <Input name="origin" label="Nhập khẩu" placeholder="Nhập nơi nhập khẩu" required />
                                <Select name="status" label="Trạng thái" options={[
                                    ...Object.keys(MaterialStatus).map(status => (
                                        { label: MaterialStatusVietnamese[status as MaterialStatus], value: status }
                                    )),
                                ]} />
                            </div>
                        </Card>
                        <Card className={`p-[18px] col-span-1`}>
                            <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <div className="grid grid-cols-2 gap-x-3">
                                    <div className="col-span-1">
                                        <Input name="weight" label="Khối lượng tịnh" placeholder="Nhập khối lượng tịnh"
                                               required />
                                    </div>
                                    <div className="col-span-1">
                                        <Input name="unit" label="Đơn vị" placeholder="Chọn đơn vị" required />
                                    </div>
                                </div>
                                <Input name="packing" label="Quy cách đóng gói" placeholder="Nhập quy cách đóng gói"
                                       required />
                                <Input name="minimum_stock_level" label="Cảnh báo số lượng đạt mức tối thiểu"
                                       placeholder="Nhập số lượng cảnh báo tối thiểu"
                                       tooltip="Nếu số lượng sản phẩm hiện có chạm mức tối thiểu, bạn sẽ nhận được cảnh báo." />
                                <Input name="maximum_stock_level" label="Cảnh báo số lượng đạt mức tối đa"
                                       placeholder="Nhập số lượng cảnh báo tối đa"
                                       tooltip="Nếu số lượng sản phẩm hiện có chạm mức tối đa, bạn sẽ nhận được cảnh báo." />

                            </div>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Ghi chú</Typography.Title>
                            <TextArea name="note" label="Ghi chú" placeholder="Ghi chú ..."/>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/materials'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={createMaterial.isPending}>
                            {createMaterial.isPending ? 'Đang xử lý...' : 'Lưu'}
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewMaterialPage;