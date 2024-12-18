'use client';
import React, { useEffect, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Card from '@/components/Card';
import { object } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import TextArea from '@/components/TextArea';
import UploadImage from '@/components/UploadImage';
import {
    ExportProductStatus,
    ExportProductType,
    ExportProductTypeVietnamese,
} from '@/modules/exports/products/interface';
import Select, { SelectProps } from '@/components/Select';
import { ExportMaterialStatus, ExportMaterialStatusVietnamese } from '@/modules/exports/materials/interface';
import { useRouter } from 'next/navigation';
import { useCreateExportProduct } from '@/modules/exports/products/repository';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import InputCurrency from '@/components/InputCurrency';
import { MdRemoveCircleOutline } from 'react-icons/md';
import { ProductOverview, ProductStatus } from '@/modules/products/interface';
import { useAllProducts } from '@/modules/products/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import ModalChooseExportProductLocation, {
    ExportProductLocation,
} from '@/components/Pages/Export/Product/ModalChooseExportProductLocation';
import ProductSearch from '@/components/ProductSearch';
import { useAllOrders, useOrderByCode } from '@/modules/orders/repository';
import { OrderStatus } from '@/modules/orders/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';

const ProductSchema = object({});

interface Product {
    id: number;
    sku: string;
    image?: string;
    name: string;
    weight: number;
    unit: string;
    packing: string;
    quantity: number;
    quantityOrdered?: number;
    quantityAvailable: number;
    locations: ExportProductLocation[];
    price: number;
}

interface FormValues {
    status: ExportProductStatus;
    note?: string;
    type: ExportProductType;
    products: Product[];
    order?: string;
}

const initialFormValues: FormValues = {
    status: ExportProductStatus.COMPLETED,
    type: ExportProductType.NORMAL,
    products: [],
};

const ProductTable = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const [selectedProduct, setSelectedProduct] = useState<{
        index: number,
        quantity: number,
        code: string
    } | null>(null);

    return (
        <>
            <TableCore className="mt-3">
                <TableCore.Header>
                    <TableCore.RowHeader>
                        <TableCore.Head>Sản phẩm</TableCore.Head>
                        <TableCore.Head>Giá bán</TableCore.Head>
                        <TableCore.Head>Tồn kho khả dụng</TableCore.Head>
                        {values.type === ExportProductType.NORMAL && <TableCore.Head>Số lượng đặt</TableCore.Head>}
                        <TableCore.Head>Số lượng xuất</TableCore.Head>
                        <TableCore.Head>Vị trí lưu kho</TableCore.Head>
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
                                                    className="flex-1 flex flex-col justify-center max-w-64">
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
                                            {formatNumberToCurrency(product.price)}
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            {product.quantityAvailable}
                                        </TableCore.Cell>
                                        {
                                            values.type === ExportProductType.NORMAL && (
                                                <TableCore.Cell>
                                                    {product.quantityOrdered}
                                                </TableCore.Cell>
                                            )
                                        }
                                        <TableCore.Cell>
                                            <InputCurrency name={`products.${index}.quantity`}
                                                           placeholder="Nhập số lượng"
                                                           step={1}
                                                           min={1}
                                                           max={product.quantityAvailable}
                                                           wrapperClassName="mb-0"
                                            />
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            {
                                                values.products[index].locations.length > 0 && (
                                                    <div className="w-60 space-y-1">
                                                        {
                                                            values.products[index].locations.map((location, index) => (
                                                                <div key={index}
                                                                     className="flex gap-2 items-center border border-dashed border-brand-500 text-brand-500 rounded-lg py-1 px-2">
                                                                    <div
                                                                        className="text-xs text-nowrap">
                                                                        {location.name} ({location.quantity})
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                            <button type="button"
                                                    className="text-brand-500 hover:underline mt-2"
                                                    onClick={() => setSelectedProduct({
                                                        index,
                                                        quantity: product.quantity,
                                                        code: product.sku,
                                                    })}
                                            >
                                                {values.products[index].locations.length > 0 ? 'Chỉnh sửa' : 'Chọn vị trí'}
                                            </button>
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

            {
                selectedProduct && (
                    <ModalChooseExportProductLocation onClose={() => setSelectedProduct(null)}
                                                      selectedLocations={values.products[selectedProduct.index].locations}
                                                      totalExportQuantity={selectedProduct.quantity}
                                                      onSubmit={(newLocations) => {
                                                          setFieldValue(`products.${selectedProduct.index}.locations`, newLocations);
                                                      }}
                                                      productCode={selectedProduct.code}
                    />
                )
            }
        </>
    );
};

interface FormSelectionProps {
    isLoading: boolean;
}

const FormSelection = ({ isLoading }: FormSelectionProps) => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const [showListProduct, setShowListProduct] = useState<boolean>(false);
    const [productSearchValue, setProductSearchValue] = useState<string>('');
    const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');

    const productQuery = useAllProducts({
        page: 1,
        search: productSearchValue,
        status: ProductStatus.ACTIVE,
    });

    const orderQuery = useAllOrders({
        status: OrderStatus.PENDING,
        code: orderSearchTerm,
    });

    const { data: order } = useOrderByCode(values.order);

    const typeOptions: SelectProps['options'] = Object.keys(ExportProductType)
        .filter(type => type !== ExportProductType.OTHER)
        .map(type => (
            {
                label: ExportProductTypeVietnamese[type as ExportProductType],
                value: type,
            }
        ));

    const orderOptions : SelectProps['options'] = (orderQuery.data?.data || []).map(order => ({
        label: `${order.code} - ${order.customer.name} - Đặt ngày ${formatDateToLocalDate(order.orderDate)}`,
        value: `${order.code}`,
    }));

    const statusOptions: SelectProps['options'] = Object.keys(ExportMaterialStatus).map(status => (
        {
            label: ExportMaterialStatusVietnamese[status as ExportMaterialStatus],
            value: status,
        }
    ));

    const availableProducts = React.useMemo(() => {
        if (!productQuery.data) return [];

        return productQuery.data.data.filter(product => {
            const hasValidPrice = product.prices && product.prices.length > 0;
            const isNotInCart = !values.products.find(p => p.id === product.id);
            const hasAvailableStock = product.quantityAvailable > 0;
            return hasValidPrice && isNotInCart && hasAvailableStock;
        });
    }, [productQuery.data, values.products]);

    const handleAddProduct = (product: ProductOverview) => {
        const newProduct: Product = {
            locations: [],
            id: product.id,
            sku: product.sku,
            quantity: 1,
            quantityAvailable: product.quantityAvailable,
            name: product.name,
            image: product.image,
            weight: product.weight,
            unit: product.unit,
            packing: product.packing,
            price: product.prices[0].price,
        };
        setFieldValue('products', [...values.products, newProduct]);
        setShowListProduct(false);
    };

    useEffect(() => {
        if (values.type === ExportProductType.NORMAL && order) {
            setFieldValue('products', order.orderDetails.map(detail => ({
                id: detail.product.id,
                sku: detail.product.sku,
                name: detail.product.name,
                weight: detail.product.weight,
                unit: detail.product.unit,
                packing: detail.product.packing,
                quantity: detail.product.quantityAvailable > detail.quantity ? detail.quantity : detail.product.quantityAvailable,
                quantityAvailable: detail.product.quantityAvailable,
                quantityOrdered: detail.quantity,
                expiryDate: new Date(),
                locations: [],
                price: detail.price,
            })));
        }
    }, [values.type, order]);

    useEffect(() => {
        if (values.type !== ExportProductType.NORMAL) {
            setFieldValue('products', []);
        }
    }, [values.type]);

    return (
        <Form>
            <div className="grid gap-x-3 mt-5">
                <Card className={`p-[18px]`}>
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                        <Select name="type"
                                required
                                label="Loại giao dịch"
                                options={typeOptions}
                        />
                        {
                            values.type === ExportProductType.NORMAL && (
                                <Select name="order"
                                        label="Đơn hàng"
                                        required
                                        placeholder="Chọn đơn hàng"
                                        searchPlaceholder="Nhập mã đơn hàng..."
                                        options={orderOptions}
                                        enableSearch
                                        onSearch={setOrderSearchTerm}
                                />
                            )
                        }
                        <Select name="status"
                                required
                                label="Trạng thái"
                                options={statusOptions}
                        />
                        <TextArea name="note" label="Ghi chú" placeholder="Nhập ghi chú (nếu có)" />
                    </div>
                </Card>
            </div>
            <div className="mt-5">
                <Card className={`p-[18px] col-span-3`}>
                    <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>
                    <div className="border p-2 rounded">
                        {
                            values.type !== ExportProductType.NORMAL && (
                                <div className="flex gap-3">
                                    <ProductSearch onSelect={handleAddProduct}
                                                   products={availableProducts}
                                                   searchValue={productSearchValue}
                                                   onSearchChange={setProductSearchValue}
                                                   showDropdown={showListProduct}
                                                   onShowDropdownChange={setShowListProduct}
                                    />
                                </div>
                            )
                        }
                        <ProductTable />
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

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/exports/materials'}>
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
    const router = useRouter();
    const createExportProduct = useCreateExportProduct();

    useEffect(() => {
        document.title = 'Nut Garden - Phiếu xuất';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        console.table(values);
        try {
            await createExportProduct.mutateAsync({
                type: values.type,
                note: values.note,
                products: values.products.flatMap(product =>
                    product.locations.map(location => ({
                        quantity: location.quantity,
                        product_history_id: location.id,
                    })),
                ),
                order_code: values.type === ExportProductType.NORMAL ? values.order : undefined,
            });
            router.push('/exports/products');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <FormSelection isLoading={createExportProduct.isPending} />
            </Formik>
        </div>
    );
};
export default NewProductPage;