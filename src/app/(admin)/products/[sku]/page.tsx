'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import { useProductBySKU } from '@/modules/products/repository';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { ProductStatusVietnamese } from '@/components/Badge/ProductStatusBadge';

const ProductDetail = () => {
    const { sku } = useParams<{ sku: string }>();
    const { data: product, isLoading } = useProductBySKU(sku);

    if (isLoading) {
        return <Loader />;
    }

    if (!product) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã sản phẩm</div>
                    <div className="text-brand-500">#{product.sku}</div>
                </div>
            </Card>
            <div className="grid grid-cols-5 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh của ${product.name}`} fill
                               className="object-cover" />
                    </div>
                </Card>
                <Card className="col-span-3 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Tên sản phẩm" value={product.name} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Danh mục"
                                  value={product.categories.length > 0 ? product.categories.map(category => category.name).join(', ') : 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Khối lượng tịnh" value={`${product.weight} ${product.unit}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Quy cách đóng gói" value={`${product.packing}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Nhập khẩu" value={`${product.origin}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Giá hiện tại"
                                  value={product?.prices[0]?.price ? formatNumberToCurrency(product?.prices[0]?.price) : 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Số lượng sẳn có" value={`${product.quantityAvailable}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Cảnh báo tồn kho tối thiểu"
                                  value={product.minimumStockLevel || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Cảnh báo tồn kho tối đa"
                                  value={product.maximumStockLevel || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Thời gian sử dụng" value={`${product.usageTime}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái" value={ProductStatusVietnamese[product.status]} />
                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Mô tả</Typography.Title>
                <p>{product.description || 'Chưa cập nhật'}</p>
            </Card>
        </div>
    );
};

export default ProductDetail;