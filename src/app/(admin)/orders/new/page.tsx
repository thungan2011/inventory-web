'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Input from '@/components/Input';
import Card from '@/components/Card';
import * as Yup from 'yup';
import { number, object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import { OrderStatus, PaymentMethod, PaymentMethodVietnamese } from '@/modules/orders/interface';
import InputCurrency from '@/components/InputCurrency';
import TextArea from '@/components/TextArea';
import Select, { SelectProps } from '@/components/Select';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
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
import AddressForm from '../../../../components/AddressForm';

const DELIVERY_METHODS = {
    SELF_PICKUP: 'Tự đến lấy',
    DELIVERY: 'Giao hàng tận',
} as const;

const DELIVERY_METHOD_OPTIONS: SelectProps['options'] = [
    { label: 'Tự đến lấy', value: DELIVERY_METHODS.SELF_PICKUP },
    { label: 'Giao hàng tận nơi', value: DELIVERY_METHODS.DELIVERY },
];

const ProductSchema = object({
    receiverName: string().required('Tên người nhận không được để trống'),
    receiverPhone: string().required('Số điện thoại người nhận không được để trống'),
    deliveryMethod: string().required('Chọn hình thức nhận hàng'),
    receiverAddress: string().when('deliveryMethod', ([deliveryMethod], schema) => {
        return deliveryMethod === DELIVERY_METHODS.DELIVERY
            ? schema.required('Địa chỉ nhận hàng không được để trống')
            : schema.optional();
    }),
    ward: string().when('deliveryMethod', ([deliveryMethod], schema) => {
        return deliveryMethod === DELIVERY_METHODS.DELIVERY
            ? schema.required('Chọn Phường/xã')
            : schema.optional();
    }),
    district: string().when('deliveryMethod', ([deliveryMethod], schema) => {
        return deliveryMethod === DELIVERY_METHODS.DELIVERY
            ? schema.required('Chọn Quận/huyện')
            : schema.optional();
    }),
    city: string().when('deliveryMethod', ([deliveryMethod], schema) => {
        return deliveryMethod === DELIVERY_METHODS.DELIVERY
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

    totalShipping: number().when('deliveryMethod', ([deliveryMethod], schema) => {
        return deliveryMethod === DELIVERY_METHODS.DELIVERY
            ? schema.required('Nhập phí vận chuyển')
            : schema.default(0);
    }),
    vat: number().required('Nhập thuế VAT'),
});

interface FormValues {
    customerId?: number;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    ward: string;
    district: string;
    city: string;
    totalShipping: number;
    totalPayment: number;
    totalPrice: number;
    deliveryMethod: string;
    vat: number;
    status: OrderStatus;
    note: string;
    products: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        sku: string;
        weight: number;
        unit: string;
        packing: string;
    }[];
}

const initialFormValues: FormValues = {
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    ward: '',
    district: '',
    city: '',
    totalShipping: 0,
    totalPayment: 0,
    totalPrice: 0,
    deliveryMethod: DELIVERY_METHOD_OPTIONS[0].value.toString(),
    vat: 10,
    status: OrderStatus.PROCESSED,
    note: '',
    products: [],
};

interface CustomerFilter extends PaginationState {
    name: string;
    code: string;
    phone: string;
}

interface ProductFilter extends PaginationState {
    search: string;
    origin: string;
    packing: string;
}

const FormContent = () => {
    const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
    const [search, setSearch] = useState<string>('');
    const [showListProduct, setShowListProduct] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setShowListProduct(false));

    // Customer
    const [customerFilters, setCustomerFilters] = useState<CustomerFilter>({
        page: 1,
        name: '',
        code: '',
        phone: '',
    });
    const customerQuery = useAllCustomers({
        page: customerFilters.page,
        name: customerFilters.name,
        code: customerFilters.code,
        phone: customerFilters.phone,
        status: CustomerStatus.ACTIVE,
    });

    const {
        data: customers,
    } = useFilterPagination({
        queryResult: customerQuery,
        initialFilters: customerFilters,
        onFilterChange: setCustomerFilters,
    });

    const [productFilters, setProductFilters] = useState<ProductFilter>({
        search: '',
        packing: '',
        origin: '',
        page: 1,
    });

    const productQuery = useAllProducts({
        page: productFilters.page,
        search: productFilters.search,
        origin: productFilters.origin,
        packing: productFilters.packing,
        status: ProductStatus.ACTIVE,
    });

    const {
        data: productsSearch,
    } = useFilterPagination({
        queryResult: productQuery,
        initialFilters: productFilters,
        onFilterChange: setProductFilters,
    });

    // Filter products before render
    const filteredProducts = React.useMemo(() => {
        if (!productsSearch) return [];

        return productsSearch.filter(product => {
            const hasValidPrice = product.prices && product.prices.length > 0;
            const isNotInCart = !values.products.find(p => p.id === product.id);
            return hasValidPrice && isNotInCart;
        });
    }, [productsSearch, values.products]);

    const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearch(newValue);
    };

    const handleAddProduct = (product: ProductOverview) => {
        const isExist = values.products.find(p => p.id === product.id);
        if (!isExist) {
            const newProduct = {
                id: product.id,
                sku: product.sku,
                quantity: 1,
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
        setSearch('');
    };

    useEffect(() => {
        const totalPrice = values.products.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);
        setFieldValue('totalPrice', totalPrice);
        setFieldValue('totalPayment', totalPrice + values.totalShipping + (totalPrice * values.vat / 100));
    }, [values.products, values.vat, values.totalShipping, setFieldValue]);

    useEffect(() => {
        if (values.deliveryMethod === DELIVERY_METHODS.SELF_PICKUP) {
            setFieldValue('totalShipping', 0);
            setFieldValue('ward', '');
            setFieldValue('district', '');
            setFieldValue('city', '');
            setFieldValue('receiverAddress', '');
        }
    }, [values.deliveryMethod, setFieldValue]);

    useEffect(() => {
        const customer = customers?.find(customer => customer.id === values.customerId);
        if (customer) {
            setFieldValue('receiverName', customer.name);
            setFieldValue('receiverPhone', customer.phone);
            setFieldValue('receiverAddress', customer.address || '');
            setFieldValue('city', customer.city || '');
            setFieldValue('district', customer.district || '');
            setFieldValue('ward', customer.ward || '');
        }
    }, [values.customerId, setFieldValue, customers]);

    const renderDeliverySection = () => {
        const isSelfPickup = values.deliveryMethod === DELIVERY_METHODS.SELF_PICKUP;

        return (
            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5">
                <Select name="deliveryMethod"
                        options={DELIVERY_METHOD_OPTIONS}
                        label="Hình thức nhận hàng"
                        placeholder="Chọn hình thức nhận hàng"
                />
                <Input name="receiverName" label="Tên người nhận" placeholder="Nhập tên người nhận"
                       required />
                <Input name="receiverPhone" label="Số điện thoại" placeholder="Nhập số điện thoại"
                       required />
                {
                    !isSelfPickup && (
                        <>
                            <Input name="receiverAddress" label="Địa chỉ" placeholder="Nhập địa chỉ" required />
                            <AddressForm city="" district="" ward="" setFieldValue={setFieldValue} />
                        </>
                    )
                }
            </div>
        );
    };

    return (
        <Form>
            <div className="grid grid-cols-6 gap-x-3">
                <div className={`col-span-4`}>
                    <Card className={`p-[18px]`}>
                        <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>
                        <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Select name="customerId" label="Mã khách hàng"
                                            options={
                                                (customers || []).map(customer => ({
                                                    label: `${customer.code} - ${customer.name} - ${customer.phone}`,
                                                    value: customer.id,
                                                }))
                                            }
                                            placeholder="Chọn mã khách hàng"
                                    />
                                </div>
                                <ButtonIcon className="h-10 mb-3" type="button" icon={<FaPlus />} />
                            </div>
                        </div>
                    </Card>
                    <Card className={`p-[18px] mt-5`}>
                        <Typography.Title level={4}>Nhận hàng và vận chuyển</Typography.Title>
                        {renderDeliverySection()}
                    </Card>
                    <Card className={`p-[18px] col-span-3 mt-5`}>
                        <Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>
                        <div className="flex gap-2 items-center">
                            <div className="font-normal text-sm cursor-pointer">Sản phẩm áp dụng:</div>
                            {errors.products && touched.products && typeof errors.products === 'string' && (
                                <div className="text-red-500 text-sm">{errors.products}</div>
                            )}
                        </div>
                        <div className="border p-2 rounded">
                            <div className="flex gap-3">
                                <div className="relative w-[500px]">
                                    <input className="border rounded h-8 px-2 text-sm w-full"
                                           value={search} onChange={onChangeSearchValue}
                                           onClick={() => setShowListProduct(true)}
                                           placeholder="Tìm theo tên hoặc mã sản phẩm" />
                                    {
                                        showListProduct && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border overflow-auto">
                                                {
                                                    filteredProducts?.map(product => {
                                                        if (values.products.find(p => p.id === product.id && product.prices.length > 0)) return null;

                                                        return (
                                                            <div key={product.id}
                                                                 className="p-2 hover:bg-gray-100 cursor-pointer"
                                                                 onClick={() => handleAddProduct(product)}>
                                                                <div className="flex gap-3">
                                                                    <div
                                                                        className="relative w-12 h-12 rounded border overflow-hidden">
                                                                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                                                               alt={`Ảnh combo ${product.name}`}
                                                                               fill
                                                                               className="object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col justify-center">
                                                                        <div className="text-sm font-medium line-clamp-1">
                                                                            #{product.sku} - {product.name}
                                                                        </div>
                                                                        <div className="text-xs line-clamp-1">
                                                                            {product.packing}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-center items-center">
                                                                        <button type="button" className="text-brand-500">
                                                                            <FaPlus />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                {
                                                    filteredProducts?.length === 0 && (
                                                        <div className="text-center text-gray-400 py-2">
                                                            Không tìm thấy sản phẩm nào
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="mt-3 min-h-64 overflow-y-auto border-t">
                                <FieldArray name="products" render={arrayHelper => (
                                    <div>
                                        {
                                            values.products.length > 0 ? (
                                                values.products.map((product, index) => (
                                                    <div key={`product-${index}`}
                                                         className={`flex justify-between gap-3 py-1 ${index !== 0 && 'border-t'}`}>
                                                        <div className="flex gap-2 flex-1 items-center">
                                                            <div className="flex justify-center items-center w-8">
                                                                {index + 1}
                                                            </div>
                                                            <div
                                                                className="relative w-14 h-14 border rounded overflow-hidden">
                                                                <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                                                       alt={`Ảnh của ${product.name}`}
                                                                       fill
                                                                       className="object-cover" />
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-center">
                                                                <div className="text-sm font-medium line-clamp-1"
                                                                     title={`${product.sku} - ${product.name}`}
                                                                >
                                                                    {product.sku} - {product.name}
                                                                </div>
                                                                <div
                                                                    className="text-xs line-clamp-1">{product.weight}{product.unit} - {product.packing}</div>
                                                            </div>
                                                            <div>
                                                                {formatNumberToCurrency(product.price)}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            <div className="w-36">
                                                                <InputCurrency name={`products.${index}.quantity`}
                                                                               placeholder="Số lượng"
                                                                               wrapperClassName="mb-0" />
                                                            </div>
                                                            <div className="w-14 flex items-center justify-center">
                                                                <button type="button"
                                                                        onClick={() => arrayHelper.remove(index)}>
                                                                    <MdRemoveCircleOutline size={20} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-gray-400 py-2">
                                                    Chưa có sản phẩm nào
                                                </div>
                                            )
                                        }
                                    </div>
                                )} />
                            </div>
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
                            <InputCurrency name="paymentAmount" label="Số tiền đã thanh toán" unit="VND" />
                        </div>
                    </Card>
                    <Card className={`p-[18px] mt-5`}>
                        <TextArea name="note" label="Ghi chú" placeholder="Ghi chú đơn hàng (nếu có)" />
                    </Card>
                </div>
                <Card className={`p-[18px] col-span-2`}>
                    <Typography.Title level={4}>Thanh toán</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 text-xs">
                        <InputCurrency name="totalPrice" label="Tổng tiền sản phẩm" unit="VND" readOnly />
                        <InputCurrency name="totalShipping" label="Phí vận chuyển" unit="VND"
                                       tooltip="Nếu bạn không nhập phí vận chuyển, hệ thống sẽ mặc định là 0 VND." />
                        <Input name="vat" label="Thuế GTGT" placeholder="Nhập thuế GTGT"
                               tooltip="Nếu không nhập thuế GTGT sẽ tự động tính toán với tỷ lệ 10% trên tổng hóa đơn." />
                        <InputCurrency name="totalPayment" label="Thanh toán" placeholder="Thanh toán" readOnly
                                       unit="VND" />
                    </div>
                </Card>
            </div>

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/orders'}>
                    <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                        Hủy bỏ
                    </ButtonIcon>
                </Link>
                <ButtonIcon icon={<FaSave />} type="submit">
                    Lưu
                </ButtonIcon>
            </div>
        </Form>
    );
};

const NewOrderPage = () => {
    useEffect(() => {
        document.title = 'Nut Garden - Tạo đơn hàng';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        console.table(values);
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <FormContent />
            </Formik>
        </div>
    );
};
export default NewOrderPage;