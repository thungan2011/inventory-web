'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useMaterialBySKU } from '@/modules/materials/repository';
import { MaterialStatusVietnamese } from '@/components/Badge/MaterialStatusBadge';

const MaterialDetail = () => {
    const { sku } = useParams<{ sku: string }>();
    const { data: material, isLoading } = useMaterialBySKU(sku);

    if (isLoading) {
        return <Loader />;
    }

    if (!material) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã nguyên vật liệu</div>
                    <div className="text-brand-500">#{material.sku}</div>
                </div>
            </Card>

            <div className="grid grid-cols-7 gap-4">
                <Card className="col-span-4 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Tên nguyên vật liệu" value={material.name} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Danh mục"
                                  value={material.categories.length > 0 ? material.categories.map(category => category.name).join(', ') : 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Khối lượng tịnh" value={`${material.weight} ${material.unit}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Quy cách đóng gói" value={`${material.packing}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Nhập khẩu" value={`${material.origin}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Số lượng sẳn có" value={`${material.quantityAvailable}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Cảnh báo tồn kho tối thiểu"
                                  value={material.minimumStockLevel || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Cảnh báo tồn kho tối đa"
                                  value={material.maximumStockLevel || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái" value={MaterialStatusVietnamese[material.status]} />
                    </div>
                </Card>
                <Card className="col-span-3 p-[18px]">
                    <div>
                        <Typography.Title level={3}>Nhà cung cấp</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Tên nhà cung cấp"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.name).join(', ') : 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Số điện thoại"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.phone).join(', ') : 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Website"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.website).join(', ') : 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Email"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.email).join(', ') : 'Chưa cập nhật'} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Typography.Title level={3}>Người liên hệ</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Tên"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.representativeName).join(', ') : 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Số điện thoại"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.representativePhone).join(', ') : 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Email"
                                      value={material.providers.length > 0 ? material.providers.map(provider => provider.representativeEmail).join(', ') : 'Chưa cập nhật'} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MaterialDetail;