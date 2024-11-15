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
import UploadImage, { ImageFile } from '@/components/UploadImage';
import Select from '@/components/Select';
import { ProductStatus } from '@/modules/products/interface';
import { ProductStatusVietnamese } from '@/components/Badge/ProductStatusBadge';
import Editor from '@/components/Editor';
import { useCreateProduct } from '@/modules/products/repository';
import { useRouter } from 'next/navigation';
import { useCategoryList } from '@/modules/categories/repository';
import Loader from '@/components/Loader';
import { CategoryType } from '@/modules/categories/interface';

const ProductSchema = object({
    name: string().required('Tên không được để trống'),
    categories: array().required('Chọn danh mục').min(1, 'Chọn tối thiểu 1 danh mục'),
    origin: string().required('Nơi nhập khẩu không được để trống'),
    weight: number().required('Khối lượng không được để trống').min(0, 'Tối thiểu là 0'),
    unit: string().required('Đơn vị không được để trống'),
    packing: string().required('Quy cách đóng gói không được để trống'),
    usage_time: string().required('Thời gian sử dụng không được để trống'),
    minimum_stock_level: number().nullable().min(0, 'Tối thiểu là 0'),
    maximum_stock_level: number().nullable().min(0, 'Tối thiểu là 0'),
});

interface FormValues {
    sku?: string;
    name: string;
    categories: number[];
    origin: string;
    status: ProductStatus;
    weight: number;
    unit: string;
    packing: string;
    usage_time: string;
    description?: string;
    image?: ImageFile[];
    minimum_stock_level?: number;
    maximum_stock_level?: number;
}

const initialFormValues: FormValues = {
    sku: '',
    name: '',
    categories: [],
    origin: '',
    status: ProductStatus.INACTIVE,
    weight: 0,
    unit: '',
    packing: '',
    usage_time: '',
    description: '',
    image: [],
    minimum_stock_level: 0,
    maximum_stock_level: 0,
};

const NewProductPage = () => {
    const router = useRouter();
    const createProduct = useCreateProduct();
    const { data: categories, isLoading: isCategoriesLoading } = useCategoryList(CategoryType.PRODUCT);

    useEffect(() => {
        document.title = 'Nut Garden - Thêm sản phẩm';
    }, []);

    if (isCategoriesLoading) {
        return <Loader />;
    }

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await createProduct.mutateAsync({
                ...values,
                category_id: values.categories,
                minimum_stock_level: values?.minimum_stock_level ? values.minimum_stock_level : 0,
                image: 'h.jpg',
            });
            router.push('/products');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    {/*<div className="mt-5">*/}
                    {/*    <Card className={`p-[18px] col-span-3`}>*/}
                    {/*        <Typography.Title level={4}>Mã sản phẩm</Typography.Title>*/}
                    {/*        <Input name="sku" placeholder="Nếu không nhập mã sản phẩm, hệ thống sẽ tự động tạo" />*/}
                    {/*    </Card>*/}
                    {/*</div>*/}
                    <div className="grid grid-cols-2 gap-x-3 mt-5">
                        <Card className={`p-[18px] col-span-1`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                                <Input name="name" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" required />
                                <Select name="categories" label="Danh mục" multiple options={
                                    categories ? categories.map(category => ({
                                        label: category.name,
                                        value: category.id,
                                    })) : []
                                } />
                                <Input name="origin" label="Nhập khẩu" placeholder="Nhập nơi nhập khẩu" required />
                                <Select name="status" label="Trạng thái" options={[
                                    ...Object.keys(ProductStatus).map(status => (
                                        { label: ProductStatusVietnamese[status as ProductStatus], value: status }
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
                                <Input name="usage_time" label="Thời gian sử dụng" placeholder="Nhập hạn sử dụng"
                                       required />
                                <Input name="minimum_stock_level" label="Cảnh báo số lượng tối thiểu"
                                       placeholder="Nhập số lượng cảnh báo tối thiểu"
                                       tooltip="Nếu số lượng sản phẩm hiện có chạm mức tối thiểu, bạn sẽ nhận được cảnh báo." />
                                <Input name="maximum_stock_level" label="Cảnh báo số lượng tối đa"
                                       placeholder="Nhập số lượng cảnh báo tối đa"
                                       tooltip="Nếu số lượng sản phẩm hiện có chạm mức tối đa, bạn sẽ nhận được cảnh báo lượng hàng trong kho còn tồn quá nhiều." />
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <div>
                                <div>
                                    <UploadImage name="image" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Mô tả</Typography.Title>
                            <Editor name="description" />
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/products'}>
                            <ButtonIcon type="button" icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit" disabled={createProduct.isPending}>
                            {createProduct.isPending ? 'Đang xử lý...' : 'Lưu'}
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewProductPage;