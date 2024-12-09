'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import * as Yup from 'yup';
import { number, object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import { DeliveryType, OrderStatus, PaymentMethod, PaymentMethodVietnamese } from '@/modules/orders/interface';
import InputCurrency from '@/components/InputCurrency';
import TextArea from '@/components/TextArea';
import Select, { SelectProps } from '@/components/Select';
import { CustomerStatus } from '@/modules/customers/interface';
import { useAllCustomers } from '@/modules/customers/repository';
import { useAllProducts } from '@/modules/products/repository';
import { ProductOverview, ProductStatus } from '@/modules/products/interface';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { FaPlus } from 'react-icons/fa6';
import { MdRemoveCircleOutline } from 'react-icons/md';
import useClickOutside from '@/hook/useClickOutside';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import AddressForm from '@/components/AddressForm';
import { useCreateOrder } from '@/modules/orders/repository';
import ButtonAction from '@/components/ButtonAction';
import dayjs from 'dayjs';
import DatePicker from '@/components/DatePicker';
import { useRouter } from 'next/navigation';
import TableCore from '@/components/Tables/TableCore';
import ProductSearch from '@/components/ProductSearch';

const DELIVERY_METHODS = {
    STORE_PICKUP: 'STORE_PICKUP',
    SHIPPING: 'SHIPPING',
} as const;

const DELIVERY_METHOD_OPTIONS: SelectProps['options'] = [
    { label: 'Tự đến lấy', value: DELIVERY_METHODS.STORE_PICKUP },
    { label: 'Giao hàng', value: DELIVERY_METHODS.SHIPPING },
];

interface Product {
    id: number;
    name: string;
    quantity: number;
    quantityAvailable: number;
    price: number;
    sku: string;
    weight: number;
    unit: string;
    packing: string;
    image?: string;
}

interface FormValues {
    customerId: number;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    ward: string;
    wardCode: string;
    district: string;
    districtCode: string;
    city: string;
    cityCode: string;
    shippingFee: number;
    totalPayment: number;
    totalPrice: number;
    deliveryType: DeliveryType;
    deliveryDate: Date;
    discountPercent: number;
    status: OrderStatus;
    note: string;
    products: Product[];
}

const initialFormValues: FormValues = {
    customerId: 0,
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    ward: '',
    wardCode: '',
    district: '',
    districtCode: '',
    city: '',
    cityCode: '',
    shippingFee: 0,
    totalPayment: 0,
    totalPrice: 0,
    deliveryType: DeliveryType.SHIPPING,
    deliveryDate: new Date(),
    discountPercent: 0,
    status: OrderStatus.PROCESSED,
    note: '',
    products: [],
};

const ProductSchema = object({
    receiverName: string().required('Tên người nhận không được để trống'),
    receiverPhone: string().required('Số điện thoại người nhận không được để trống'),
    deliveryType: string().required('Chọn hình thức nhận hàng'),
    receiverAddress: string().when('deliveryType', ([deliveryType], schema) => {
        return deliveryType === DELIVERY_METHODS.SHIPPING
            ? schema.required('Địa chỉ nhận hàng không được để trống')
            : schema.optional();
    }),
    ward: string().when('deliveryType', ([deliveryType], schema) => {
        return deliveryType === DELIVERY_METHODS.SHIPPING
            ? schema.required('Chọn Phường/xã')
            : schema.optional();
    }),
    district: string().when('deliveryType', ([deliveryType], schema) => {
        return deliveryType === DELIVERY_METHODS.SHIPPING
            ? schema.required('Chọn Quận/huyện')
            : schema.optional();
    }),
    city: string().when('deliveryType', ([deliveryType], schema) => {
        return deliveryType === DELIVERY_METHODS.SHIPPING
            ? schema.required('Chọn Tỉnh/thành phố')
            : schema.optional();
    }),
    products: Yup.array().of(
        Yup.object().shape({
            quantity: Yup.number().required('Số lượng không được để trống')
                .min(1, 'Số lượng tối thiểu là 1')
                .max(100000, 'Số lượng phải nhỏ hơn 100.000'),
        }),
    ).min(1, 'Vui lòng chọn ít nhất 1 sản phẩm'),

    shippingFee: number().when('deliveryType', ([deliveryType], schema) => {
        return deliveryType === DELIVERY_METHODS.SHIPPING
            ? schema.required('Nhập phí vận chuyển')
            : schema.default(0);
    }),
    discountPercent: number().required('Nhập thuế VAT'),
});

interface ProductTableProps {
    products: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
    const { setFieldValue } = useFormikContext<FormValues>();

    const handleQuantityChange = (index: number, newValue: number) => {
        if (newValue <= 0) {
            console.log('remove');
            const newProducts = [...products];
            console.log(newProducts);
            newProducts.splice(index, 1);
            setFieldValue('products', newProducts);
        }
    };

    return (
        <TableCore className="mt-3">
            <TableCore.Header>
                <TableCore.RowHeader>
                    <TableCore.Head>Sản phẩm</TableCore.Head>
                    <TableCore.Head>Giá</TableCore.Head>
                    <TableCore.Head>Số lượng</TableCore.Head>
                    <TableCore.Head className="!max-w-8">Thành tiền</TableCore.Head>
                    <TableCore.Head className="!max-w-8"></TableCore.Head>
                </TableCore.RowHeader>
            </TableCore.Header>
            <FieldArray name="products" render={arrayHelper => (
                <TableCore.Body>
                    {
                        products.length > 0 ? (
                            products.map((product, index) => (
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
                                                className="flex-1 flex flex-col justify-center max-w-72">
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
                                    <TableCore.Cell>{formatNumberToCurrency(product.price)}</TableCore.Cell>
                                    <TableCore.Cell>
                                        <InputCurrency name={`products.${index}.quantity`}
                                                       placeholder="Nhập số lượng"
                                                       max={product.quantityAvailable}
                                                       min={0}
                                                       step={1}
                                                       wrapperClassName="mb-0"
                                                       onChange={(value) => handleQuantityChange(index, value)}
                                        />
                                    </TableCore.Cell>
                                    <TableCore.Cell>
                                        {formatNumberToCurrency(product.price * product.quantity)}
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
    );
};

interface FormContentProps {
    isLoading: boolean;
}

const FormContent = ({ isLoading }: FormContentProps) => {
    const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
    const [showListProduct, setShowListProduct] = useState<boolean>(false);
    const [productSearchTerm, setProductSearchTerm] = useState<string>('');
    const [customerSearchTerm, setCustomerSearchTerm] = useState<string>('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setShowListProduct(false));

    const customerQuery = useAllCustomers({
        page: 1,
        name: customerSearchTerm,
        status: CustomerStatus.ACTIVE,
    });

    const productQuery = useAllProducts({
        page: 1,
        search: productSearchTerm,
        status: ProductStatus.ACTIVE,
    });

    const customerOptions = React.useMemo(() => {
        return (customerQuery.data?.data || []).map(customer => ({
            value: customer.id,
            label: `${customer.code} - ${customer.name} - ${customer.phone}`,
        }));
    }, [customerQuery.data]);

    // Filter products before render
    const availableProducts = React.useMemo(() => {
        if (!productQuery.data) return [];

        return productQuery.data.data.filter(product => {
            const hasValidPrice = product.prices && product.prices.length > 0;
            const isNotInCart = !values.products.find(p => p.id === product.id);
            const hasAvailableStock = product.quantityAvailable > 0;
            return hasValidPrice && isNotInCart && hasAvailableStock;
        });
    }, [productQuery.data, values.products]);

    useEffect(() => {
        const totalPrice = values.products.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);
        setFieldValue('totalPrice', totalPrice);
        setFieldValue('totalPayment', totalPrice + values.shippingFee - (totalPrice * values.discountPercent / 100));
    }, [values.products, values.discountPercent, values.shippingFee, setFieldValue]);

    useEffect(() => {
        if (values.deliveryType === DELIVERY_METHODS.STORE_PICKUP) {
            setFieldValue('shippingFee', 0);
            setFieldValue('ward', '');
            setFieldValue('district', '');
            setFieldValue('city', '');
            setFieldValue('receiverAddress', '');
        }
    }, [values.deliveryType, setFieldValue]);

    useEffect(() => {
        const selectedCustomer = customerQuery.data?.data.find(c => c.id === values.customerId);
        if (selectedCustomer) {
            setFieldValue('receiverName', selectedCustomer.name);
            setFieldValue('receiverPhone', selectedCustomer.phone);
            setFieldValue('receiverAddress', selectedCustomer.address || '');
            setFieldValue('city', selectedCustomer.city || '');
            setFieldValue('district', selectedCustomer.district || '');
            setFieldValue('ward', selectedCustomer.ward || '');
        }
    }, [values.customerId, setFieldValue, customerQuery.data]);

    const handleAddProduct = (product: ProductOverview) => {
        const isExist = values.products.find(p => p.id === product.id);
        if (!isExist) {
            const newProduct: Product = {
                id: product.id,
                sku: product.sku,
                quantity: 1,
                quantityAvailable: product.quantityAvailable,
                price: product.prices[0].price,
                name: product.name,
                image: product.image,
                weight: product.weight,
                unit: product.unit,
                packing: product.packing,
            };
            setFieldValue('products', [...values.products, newProduct]);
        }
        setShowListProduct(false);
    };

    return (
        <Form>
            <div className="grid grid-cols-8 gap-x-3">
                <div className={`col-span-6`}>
                    <Card className={`p-[18px]`}>
                        <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>
                        <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Select name="customerId" label="Khách hàng"
                                            options={customerOptions}
                                            placeholder="Chọn khách hàng"
                                            searchPlaceholder="Tìm theo tên..."
                                            enableSearch={true}
                                            onSearch={setCustomerSearchTerm}
                                    />
                                </div>
                                <ButtonIcon className="h-10 mb-3" type="button" icon={<FaPlus />} />
                            </div>
                        </div>
                    </Card>

                    <Card className={`p-[18px] mt-5`}>
                        <Typography.Title level={4}>Nhận hàng và vận chuyển</Typography.Title>
                        <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                            <Select name="deliveryType"
                                    options={DELIVERY_METHOD_OPTIONS}
                                    label="Hình thức nhận hàng"
                                    placeholder="Chọn hình thức nhận hàng"
                            />
                            <DatePicker name="deliveryDate"
                                        minDate={dayjs().toDate()}
                                        label="Ngày giao hàng dự kiến"
                            />
                            <Input name="receiverName"
                                   label="Tên người nhận"
                                   placeholder="Nhập tên người nhận"
                                   required
                            />
                            <Input name="receiverPhone"
                                   label="Số điện thoại"
                                   placeholder="Nhập số điện thoại"
                                   required
                            />
                            {
                                values.deliveryType === DELIVERY_METHODS.SHIPPING && (
                                    <>
                                        <Input name="receiverAddress"
                                               label="Địa chỉ"
                                               placeholder="Nhập địa chỉ"
                                               required
                                        />
                                        <AddressForm />
                                    </>
                                )
                            }
                            <TextArea name="note" label="Ghi chú" placeholder="Ghi chú đơn hàng (nếu có)" />
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
                                               products={availableProducts}
                                               searchValue={productSearchTerm}
                                               onSearchChange={setProductSearchTerm}
                                               showDropdown={showListProduct}
                                               onShowDropdownChange={setShowListProduct}
                                />
                            </div>
                            <ProductTable products={values.products} />
                        </div>
                    </Card>
                    <Card className={`p-[18px] mt-5`}>
                        <Typography.Title level={4}>Hình thức thanh toán</Typography.Title>
                        <div
                            className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 grid grid-cols-2 gap-x-3">
                            <Select label="Đã thanh toán" name="paymentMethod" placeholder="Chọn hình thức thanh toán"
                                    options={
                                        Object.values(PaymentMethod).map(method => ({
                                            label: PaymentMethodVietnamese[method],
                                            value: method,
                                        }))
                                    }
                            />
                            <InputCurrency name="paymentAmount"
                                           placeholder="Nhập số tiền thanh toán"
                                           label="Số tiền đã thanh toán"
                                           unit="VND"
                            />
                        </div>
                    </Card>
                </div>

                <div className="col-span-2 relative">
                    <div className="sticky top-16 w-full max-w-full">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Thanh toán</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 text-xs">
                                <InputCurrency name="totalPrice"
                                               label="Tổng tiền sản phẩm"
                                               unit="VND"
                                               readOnly
                                />
                                <InputCurrency name="shippingFee"
                                               label="Phí vận chuyển"
                                               unit="VND"
                                               readOnly={values.deliveryType === DELIVERY_METHODS.STORE_PICKUP}
                                               tooltip="Nếu bạn không nhập phí vận chuyển, hệ thống sẽ mặc định là 0 VND."
                                />
                                <Input name="discountPercent"
                                       label="Chiết khấu"
                                       placeholder="Nhập chiếc khấu"
                                       tooltip="Nếu không nhập thuế GTGT sẽ tự động tính toán với tỷ lệ 10% trên tổng hóa đơn."
                                       unit="%"
                                />
                                <InputCurrency name="totalPayment"
                                               label="Thanh toán"
                                               placeholder="Thanh toán"
                                               readOnly
                                               unit="VND"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/orders'}>
                    <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                        Hủy bỏ
                    </ButtonIcon>
                </Link>
                <ButtonAction.Submit isLoading={isLoading} />
            </div>
        </Form>
    );
};

const NewOrderPage = () => {
    const router = useRouter();
    const createOrder = useCreateOrder();

    useEffect(() => {
        document.title = 'Nut Garden - Tạo đơn hàng';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        console.table(values);
        try {
            await createOrder.mutateAsync({
                address: values.receiverAddress,
                delivery_date: dayjs(values.deliveryDate).format('YYYY-MM-DD'),
                delivery_type: values.deliveryType,
                discount_percent: values.discountPercent,
                shipping_fee: values.shippingFee,
                payment_method: PaymentMethod.CASH,
                phone: values.receiverPhone,
                products: values.products.map(product => ({ product_id: product.id, quantity: product.quantity })),
                customer_id: values.customerId || 1,
                city: `${values.city} - ${values.cityCode}`,
                district: `${values.district} - ${values.districtCode}`,
                ward: `${values.ward} - ${values.wardCode}`,
                status: OrderStatus.PENDING,
                note: values.note,
            });
            router.push('/orders');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <FormContent isLoading={createOrder.isPending} />
            </Formik>
        </div>
    );
};
export default NewOrderPage;