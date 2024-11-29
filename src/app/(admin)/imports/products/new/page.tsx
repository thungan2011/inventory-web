'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Card from '@/components/Card';
import { object } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import Select, { SelectProps } from '@/components/Select';
import TextArea from '@/components/TextArea';
import UploadImage from '@/components/UploadImage';
import {
    ImportProductStatus,
    ImportProductStatusVietnamese,
    ImportProductType,
    ImportProductTypesVietnamese,
} from '@/modules/imports/products/interface';
import ProductSearch from '@/components/ProductSearch';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import InputCurrency from '@/components/InputCurrency';
import { MdRemoveCircleOutline } from 'react-icons/md';
import useClickOutside from '@/hook/useClickOutside';
import { ProductOverview, ProductStatus } from '@/modules/products/interface';
import { useAllProducts } from '@/modules/products/repository';

const ProductSchema = object({});

interface FormValues {
    status: ImportProductStatus;
    receiverNam: string;
    note: string;
    type: ImportProductType;
    products: {
        id: number;
        sku: string;
        name: string;
        weight: number;
        unit: string;
        packing: string;
        quantity: number;
    }[];
}

const initialFormValues: FormValues = {
    receiverNam: '',
    status: ImportProductStatus.COMPLETED,
    note: '',
    type: ImportProductType.NORMAL,
    products: [],
};

interface FormContentProps {
    isLoading: boolean;
}

const FormContent = ({ isLoading }: FormContentProps) => {
    const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
    const [showListProduct, setShowListProduct] = useState<boolean>(false);
    const [productSearchValue, setProductSearchValue] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setShowListProduct(false));


    const typeOptions: SelectProps['options'] = Object.keys(ImportProductType).map(type => (
        {
            label: ImportProductTypesVietnamese[type as ImportProductType],
            value: type,
        }
    ));

    const statusOptions: SelectProps['options'] = Object.keys(ImportProductStatus).map(status => (
        {
            label: ImportProductStatusVietnamese[status as ImportProductStatus],
            value: status,
        }
    ));

    const productQuery = useAllProducts({
        page: 1,
        search: productSearchValue,
        status: ProductStatus.ACTIVE,
    });

    const filteredProducts = React.useMemo(() => {
        if (!productQuery.data) return [];

        return productQuery.data.data.filter(product => {
            const hasValidPrice = product.prices && product.prices.length > 0;
            const isNotInCart = !values.products.find(p => p.id === product.id);
            return hasValidPrice && isNotInCart;
        });
    }, [productQuery.data, values.products]);

    const handleAddProduct = (product: ProductOverview) => {
        const isExist = values.products.find(p => p.id === product.id);
        if (!isExist) {
            const newProduct = {
                id: product.id,
                sku: product.sku,
                quantity: 1,
                name: product.name,
                image: product.image,
                weight: product.weight,
                unit: product.unit,
                packing: product.packing,
            };
            setFieldValue('products', [...values.products, newProduct]);
        }
        setShowListProduct(false);
        setProductSearchValue('');
    };

    return (
        <Form>
            <Card className={`p-[18px] mt-5`}>
                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                    <Select name="type"
                            label="Loại giao dịch"
                            options={typeOptions}
                    />
                    <Select name="status"
                            label="Trạng thái"
                            options={statusOptions}
                    />
                    <TextArea name="note"
                              label="Ghi chú"
                              placeholder="Nhập ghi chú (nếu có)"
                    />
                </div>
            </Card>

            <Card className={`p-[18px] col-span-3 mt-5`}>
                <Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>
                <div className="flex gap-2 items-center">
                    <div className="font-normal text-sm cursor-pointer">Sản phẩm áp dụng:</div>
                    {errors.products && touched.products && typeof errors.products === 'string' && (
                        <div className="text-red-500 text-xs">{errors.products}</div>
                    )}
                </div>
                <div className="border p-2 rounded">
                    <div className="flex gap-3">
                        <ProductSearch onSelect={handleAddProduct}
                                       products={filteredProducts}
                                       searchValue={productSearchValue}
                                       onSearchChange={setProductSearchValue}
                                       showDropdown={showListProduct}
                                       onShowDropdownChange={setShowListProduct}
                        />
                    </div>
                    <TableCore className="mt-3">
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head>Sản phẩm</TableCore.Head>
                                <TableCore.Head>Số lượng</TableCore.Head>
                                <TableCore.Head className="!max-w-8"></TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>
                        <FieldArray name="products" render={arrayHelper => (
                            <TableCore.Body>
                                {
                                    values.products.length > 0 ? (
                                        values.products.map((product, index) => (
                                            <TableCore.RowBody key={product.id}>
                                                <TableCore.Cell>
                                                    <div className="flex gap-2">
                                                        <div
                                                            className="relative w-14 h-14 border rounded overflow-hidden">
                                                            <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                                                   alt={`Ảnh của ${product.name}`}
                                                                   fill
                                                                   className="object-cover" />
                                                        </div>
                                                        <div
                                                            className="flex-1 flex flex-col justify-center max-w-96">
                                                            <div
                                                                className="text-sm font-medium line-clamp-1"
                                                                title={`${product.sku} - ${product.name}`}
                                                            >
                                                                {product.sku} - {product.name}
                                                            </div>
                                                            <div
                                                                className="text-xs line-clamp-1">{product.weight}{product.unit} - {product.packing}</div>
                                                        </div>
                                                    </div>
                                                </TableCore.Cell>
                                                <TableCore.Cell>
                                                    <InputCurrency name={`products.${index}.quantity`}
                                                                   placeholder="Nhập số lượng"
                                                                   step={1}
                                                    />
                                                </TableCore.Cell>
                                                <TableCore.Cell>
                                                    <div className="flex justify-end items-center">
                                                        <button type="button"
                                                                onClick={() => arrayHelper.remove(index)}>
                                                            <MdRemoveCircleOutline size={20} />
                                                        </button>
                                                    </div>
                                                </TableCore.Cell>
                                            </TableCore.RowBody>
                                        ))
                                    ) : (
                                        <TableCore.RowBody>
                                            <TableCore.Cell colSpan={5}>
                                                <div className="text-center text-gray-400 py-10">
                                                    Chưa có sản phẩm nào
                                                </div>
                                            </TableCore.Cell>
                                        </TableCore.RowBody>
                                    )
                                }
                            </TableCore.Body>
                        )} />
                    </TableCore>
                </div>
            </Card>

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

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/imports/products'}>
                    <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                        Hủy bỏ
                    </ButtonIcon>
                </Link>
                <ButtonIcon icon={<FaSave />} type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                </ButtonIcon>
            </div>
        </Form>
    );
};

const NewProductPage = () => {

    useEffect(() => {
        document.title = 'Nut Garden - Tạo phiếu nhập';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <FormContent isLoading={false} />
            </Formik>
        </div>
    );
};
export default NewProductPage;