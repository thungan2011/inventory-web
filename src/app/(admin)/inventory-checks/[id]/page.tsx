'use client';
import React, { useEffect, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Card from '@/components/Card';
import { array, object } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useInventoryCheckById, useUpdateInventoryCheck } from '@/modules/inventory-checks/repository';
import ItemInfo from '@/components/ItemInfo';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { StorageAreaTypeVietnamese } from '@/components/Badge/StorageAreaTypeBadge';
import TableCore from '@/components/Tables/TableCore';
import { useAllWarehouseAreaProducts } from '@/modules/warehouse-area/products/repository';
import { WarehouseAreaProductOverview, WarehouseAreaProductStatus } from '@/modules/warehouse-area/products/interface';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import Image from 'next/image';
import { MdRemoveCircleOutline } from 'react-icons/md';
import InputCurrency from '@/components/InputCurrency';
import { InventoryCheckDetail } from '@/modules/inventory-checks/interface';
import { StorageAreaType } from '@/modules/storage-area/interface';
import Search from '@/components/Search';
import { useAllWarehouseAreaMaterials } from '@/modules/warehouse-area/materials/repository';
import {
    WarehouseAreaMaterialOverview,
    WarehouseAreaMaterialStatus,
} from '@/modules/warehouse-area/materials/interface';

const inventoryCheckSchema = object({
    items: array().required(),
});

interface FormValues {
    items: {
        quantitySystem: number;
        quantityActual: number;
        historyStorageId: number;
        product?: {
            id: number;
            sku: string;
            name: string;
            weight: number;
            unit: string;
            packing: string;
        };
        material?: {
            id: number;
            sku: string;
            name: string;
            weight: number;
            unit: string;
            packing: string;
        };
    }[];
}

const ProductTable = ({ inventoryCheck }: { inventoryCheck: InventoryCheckDetail }) => {
    const { values } = useFormikContext<FormValues>();

    return (
        <TableCore className="mt-3">
            <TableCore.Header>
                <TableCore.RowHeader>
                    <TableCore.Head>Sản phẩm</TableCore.Head>
                    <TableCore.Head>Tồn kho hệ thống</TableCore.Head>
                    <TableCore.Head>Tồn kho thực tế</TableCore.Head>
                    <TableCore.Head className="!max-w-8"></TableCore.Head>
                </TableCore.RowHeader>
            </TableCore.Header>
            <FieldArray name="items" render={arrayHelper => (
                <TableCore.Body>
                    {
                        values.items.length > 0 ? (
                            values.items.map((item, index) => (
                                <TableCore.RowBody key={item.historyStorageId}>
                                    <TableCore.Cell>
                                        {
                                            inventoryCheck.storageArea.type === StorageAreaType.PRODUCT ? (
                                                <div className="flex gap-2">
                                                    <div
                                                        className="relative w-14 h-14 border rounded overflow-hidden">
                                                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                                               alt={`Ảnh của ${item.product?.name}`}
                                                               fill
                                                               className="object-cover" />
                                                    </div>
                                                    <div
                                                        className="flex-1 flex flex-col justify-center max-w-96">
                                                        <div
                                                            className="text-sm font-medium line-clamp-1"
                                                            title={`${item.product?.sku} - ${item.product?.name}`}
                                                        >
                                                            {item.product?.sku} - {item.product?.name}
                                                        </div>
                                                        <div
                                                            className="text-xs line-clamp-1">{item.product?.weight}{item.product?.unit} - {item.product?.packing}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <div
                                                        className="relative w-14 h-14 border rounded overflow-hidden">
                                                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                                               alt={`Ảnh của ${item.material?.name}`}
                                                               fill
                                                               className="object-cover" />
                                                    </div>
                                                    <div
                                                        className="flex-1 flex flex-col justify-center max-w-96">
                                                        <div
                                                            className="text-sm font-medium line-clamp-1"
                                                            title={`${item.material?.sku} - ${item.material?.name}`}
                                                        >
                                                            {item.material?.sku} - {item.material?.name}
                                                        </div>
                                                        <div
                                                            className="text-xs line-clamp-1">{item.material?.weight}{item.material?.unit} - {item.material?.packing}</div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </TableCore.Cell>
                                    <TableCore.Cell>
                                        {item.quantitySystem}
                                    </TableCore.Cell>
                                    <TableCore.Cell>
                                        <InputCurrency name={`items.${index}.quantityActual`}
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
                                <TableCore.Cell colSpan={3}>
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
    inventoryCheck: InventoryCheckDetail;
}

const FormContentProduct = ({ isLoading, inventoryCheck }: FormContentProps) => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const [productSearchTerm, setProductSearchTerm] = useState<string>('');
    const [materialSearchTerm, setMaterialSearchTerm] = useState<string>('');
    const [showListProduct, setShowListProduct] = useState<boolean>(false);
    const [showListMaterial, setShowListMaterial] = useState<boolean>(false);

    const warehouseAreaProductQuery = useAllWarehouseAreaProducts({
        search: inventoryCheck.storageArea.code,
        search_product: productSearchTerm,
        status: WarehouseAreaProductStatus.ACTIVE,
    });

    const warehouseAreaMaterialQuery = useAllWarehouseAreaMaterials({
        material_search: materialSearchTerm,
        search: inventoryCheck.storageArea.code,
        status: WarehouseAreaMaterialStatus.ACTIVE,
    });

    const RenderProductSearchItem = ({ item, onSelect }: {
        item: WarehouseAreaProductOverview;
        onSelect: (item: WarehouseAreaProductOverview) => void
    }) => {
        return (
            <div className="p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                 onClick={() => onSelect(item)}>
                <div className="flex gap-2">
                    <div className="relative h-14 w-14">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                               alt={`Ảnh ${item.product.name}`} fill
                               className="object-cover rounded border shadow"
                        />
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                        <div>#{item.product.sku} - {item.product.name}</div>
                        <div className="flex gap-2">
                            <div>{item.product.weight}{item.product.unit} / {item.product.packing}</div>
                            <div>|</div>
                            <div>{formatDateToLocalDate(item.expiryDate)}</div>
                        </div>
                    </div>
                </div>
                <div>
                    Tồn kho: {item.quantityAvailable}
                </div>
            </div>
        );
    };

    const RenderMaterialSearchItem = ({ item, onSelect }: {
        item: WarehouseAreaMaterialOverview;
        onSelect: (item: WarehouseAreaMaterialOverview) => void
    }) => {
        return (
            <div className="p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                 onClick={() => onSelect(item)}>
                <div className="flex gap-2">
                    <div className="relative h-14 w-14">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                               alt={`Ảnh ${item.material.name}`} fill
                               className="object-cover rounded border shadow"
                        />
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                        <div>#{item.material.sku} - {item.material.name}</div>
                        <div className="flex gap-2">
                            <div>{item.material.weight}{item.material.unit} / {item.material.packing}</div>
                            <div>|</div>
                            <div>{formatDateToLocalDate(item.expiryDate)}</div>
                        </div>
                    </div>
                </div>
                <div>
                    Tồn kho: {item.quantityAvailable}
                </div>
            </div>
        );
    };

    const handleSelect = (item: WarehouseAreaProductOverview) => {
        const newItem = {
            quantitySystem: item.quantityAvailable,
            quantityActual: item.quantityAvailable,
            historyStorageId: item.id,
            product: {
                id: item.product.id,
                sku: item.product.sku,
                name: item.product.name,
                weight: item.product.weight,
                unit: item.product.unit,
                packing: item.product.packing,
            },
        };
        setFieldValue('items', [...values.items, newItem]);
        setShowListProduct(false);
        setProductSearchTerm('');
    };

    const handleMaterialSelect = (item: WarehouseAreaMaterialOverview) => {
        const newItem = {
            quantitySystem: item.quantityAvailable,
            quantityActual: item.quantityAvailable,
            historyStorageId: item.id,
            material: {
                id: item.material.id,
                sku: item.material.sku,
                name: item.material.name,
                weight: item.material.weight,
                unit: item.material.unit,
                packing: item.material.packing,
            },
        };
        setFieldValue('items', [...values.items, newItem]);
        setShowListMaterial(false);
        setMaterialSearchTerm('');
    };

    const availableProducts = React.useMemo(() => {
        if (!warehouseAreaProductQuery.data) return [];

        return warehouseAreaProductQuery.data.data.filter(product => {
            const isNotInCart = !values.items.find(p => p.historyStorageId === product.id);
            const hasAvailableStock = product.quantityAvailable > 0;
            return isNotInCart && hasAvailableStock;
        });
    }, [warehouseAreaProductQuery.data, values.items]);

    const availableMaterials = React.useMemo(() => {
        if (!warehouseAreaMaterialQuery.data) return [];

        return warehouseAreaMaterialQuery.data.data.filter(material => {
            const isNotInCart = !values.items.find(p => p.historyStorageId === material.id);
            const hasAvailableStock = material.quantityAvailable > 0;
            return isNotInCart && hasAvailableStock;
        });
    }, [warehouseAreaMaterialQuery.data, values.items]);

    return (
        <Form>
            <Card className={`p-[18px] col-span-4 mt-5`}>
                <Typography.Title level={4}>Chi tiết kiểm kho</Typography.Title>
                <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                    <div>
                        {
                            inventoryCheck.storageArea.type === StorageAreaType.PRODUCT ? (
                                <Search onSelect={handleSelect}
                                        placeholder="Tìm kiếm sản phẩm"
                                        items={availableProducts}
                                        searchValue={productSearchTerm}
                                        onSearchChange={setProductSearchTerm}
                                        showDropdown={showListProduct}
                                        onShowDropdownChange={setShowListProduct}
                                        renderItem={(item, onSelect) => (
                                            <RenderProductSearchItem item={item} onSelect={onSelect} />
                                        )}
                                />
                            ) : (
                                <Search onSelect={handleMaterialSelect}
                                        placeholder="Tìm kiếm nguyên vật liệu"
                                        items={availableMaterials}
                                        searchValue={materialSearchTerm}
                                        onSearchChange={setMaterialSearchTerm}
                                        showDropdown={showListMaterial}
                                        onShowDropdownChange={setShowListMaterial}
                                        renderItem={(item, onSelect) => (
                                            <RenderMaterialSearchItem item={item} onSelect={onSelect} />
                                        )}
                                />
                            )
                        }
                        <ProductTable inventoryCheck={inventoryCheck} />

                    </div>
                </div>
            </Card>

            <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                <Link href={'/employees'}>
                    <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                        Hủy bỏ
                    </ButtonIcon>
                </Link>
                <ButtonIcon icon={<FaSave />} type="submit">
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                </ButtonIcon>
            </div>
        </Form>
    );
};

const UpdateEmployeePage = () => {
    const router = useRouter();
    const updateInventoryCheck = useUpdateInventoryCheck();

    const { id } = useParams<{ id: string }>();
    const { data: inventoryChecks, isLoading } = useInventoryCheckById(id);

    useEffect(() => {
        document.title = 'Nut Garden - Kiểm kho';
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (!inventoryChecks) {
        return <NotFound />;
    }

    const initialFormValues: FormValues = {
        items: [],
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);

        try {
            await updateInventoryCheck.mutateAsync({
                id: inventoryChecks.id,
                payload: {
                    details: values.items.map(item => ({
                        history_id: item.historyStorageId,
                        actual_quantity: item.quantityActual,
                        reason: 'không',
                    })),
                },
            });
            router.push('/inventory-checks');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className={`p-[18px]`}>
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="space-y-1">
                        <ItemInfo label="Ngày kiểm" value={formatDateToLocalDate(inventoryChecks.checkDate)} />
                        <ItemInfo label="Ghi chú" value={inventoryChecks.note} />
                    </div>
                </Card>
                <Card className={`p-[18px]`}>
                    <Typography.Title level={4}>Thông tin kho</Typography.Title>
                    <div className="space-y-1">
                        <ItemInfo label="Mã kho" value={inventoryChecks.storageArea.code} />
                        <ItemInfo label="Tên kho" value={inventoryChecks.storageArea.name} />
                        <ItemInfo label="Loại kho"
                                  value={StorageAreaTypeVietnamese[inventoryChecks.storageArea.type]} />
                    </div>
                </Card>
            </div>

            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={inventoryCheckSchema}>
                <FormContentProduct isLoading={false} inventoryCheck={inventoryChecks} />
            </Formik>
        </div>
    );
};
export default UpdateEmployeePage;