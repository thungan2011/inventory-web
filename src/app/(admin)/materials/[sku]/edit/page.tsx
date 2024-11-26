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
import { useParams, useRouter } from 'next/navigation';
import { useMaterialBySKU, useUpdateMaterial } from '@/modules/materials/repository';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { MaterialStatusVietnamese } from '@/components/Badge/MaterialStatusBadge';
import { useCategoryList } from '@/modules/categories/repository';
import { CategoryType } from '@/modules/categories/interface';

const ProductSchema = object({
    name: string().required('Tên không được để trống'),
    categories: array().required('Chọn danh mục').min(1, 'Chọn tối thiểu 1 danh mục'),
    origin: string().required('Nơi nhập khẩu không được để trống'),
    weight: number().required('Khối lượng không được để trống'),
    unit: string().required('Đơn vị không được để trống'),
    packing: string().required('Quy cách đóng gói không được để trống'),
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

const NewMaterialPage = () => {
    const router = useRouter();

    const { sku } = useParams<{ sku: string }>();
    const { data: material, isLoading } = useMaterialBySKU(sku);
    const updateMaterial = useUpdateMaterial();
    const { data: categories, isLoading: isCategoriesLoading } = useCategoryList(CategoryType.MATERIAL);

    useEffect(() => {
        document.title = 'Nut Garden - Cập nhật sản phẩm';
    }, []);

    if (isCategoriesLoading) {
        return <Loader />;
    }

    if (isLoading) {
        return <Loader />;
    }

    if (!material) {
        return <NotFound />;
    }

    const initialFormValues: FormValues = {
        sku: material.sku,
        name: material.name,
        categories: material.categories.map(category => category.id),
        origin: material.origin,
        status: material.status,
        weight: material.weight,
        unit: material.unit,
        packing: material.packing,
        note: material.note || '',
        minimum_stock_level: material.minimumStockLevel,
        maximum_stock_level: material.maximumStockLevel,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await updateMaterial.mutateAsync({
                id: material.id,
                payload: {
                    ...values,
                    category_id: values.categories,
                },
            });
            router.push('/materials');
        } catch (error) {
            console.log(error);
        }
    };

    const isReadOnly = material.status === MaterialStatus.ACTIVE;

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="mt-5">
                        <Card className="p-[18px]">
                            <div className="flex gap-1 text-xl font-nunito font-medium">
                                <div>Mã sản phẩm</div>
                                <div className="text-brand-500">#{material.sku}</div>
                            </div>
                        </Card>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 mt-5">
                        <Card className={`p-[18px] col-span-1`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input readOnly={isReadOnly} name="name" label="Tên nguyên vật liệu" placeholder="Nhập tên nguyên vật liệu"
                                       required />
                                <Select readOnly={isReadOnly} name="categories" label="Danh mục" multiple options={
                                    categories ? categories.map(category => ({
                                        label: category.name,
                                        value: category.id,
                                    })) : []
                                } />
                                <Input readOnly={isReadOnly} name="origin" label="Nhập khẩu" placeholder="Nhập nơi nhập khẩu" required />
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
                                        <Input readOnly={isReadOnly} name="weight" label="Khối lượng tịnh" placeholder="Nhập khối lượng tịnh"
                                               required />
                                    </div>
                                    <div className="col-span-1">
                                        <Input readOnly={isReadOnly} name="unit" label="Đơn vị" placeholder="Chọn đơn vị" required />
                                    </div>
                                </div>
                                <Input readOnly={isReadOnly} name="packing" label="Quy cách đóng gói" placeholder="Nhập quy cách đóng gói"
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
                            <TextArea name="note" label="Ghi chú" />
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/materials'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={updateMaterial.isPending}>
                            {updateMaterial.isPending ? 'Đang xử lý...' : 'Lưu'}
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewMaterialPage;