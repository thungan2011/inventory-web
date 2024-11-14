'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useProviderByCode } from '@/modules/providers/repository';
import { BaseStatusVietnamese } from '@/modules/base/interface';

const ProviderDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: provider, isLoading } = useProviderByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!provider) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã nhà cung cấp</div>
                    <div className="text-brand-500">#{provider.code}</div>
                </div>
            </Card>
            <div className="grid grid-cols-8 gap-4">
                <Card className="col-span-5 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Tên"
                                  value={provider.name || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Số điện thoại"
                                  value={provider.phone || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Địa chỉ"
                                  value={`${provider.address}, ${provider.ward}, ${provider.district}, ${provider.city}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Email"
                                  value={provider.email || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Website"
                                  value={provider.website || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái" value={BaseStatusVietnamese[provider.status]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Ghi chú"
                                  value={provider.note || 'Chưa cập nhật'} />
                    </div>
                </Card>
                <Card className="col-span-3 p-[18px]">
                    <Typography.Title level={3}>Thông tin người liên hệ</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Tên"
                                  value={provider.representativeName || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Số điện thoại"
                                  value={provider.representativePhone || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Email"
                                  value={provider.representativeEmail || 'Chưa cập nhật'} />
                    </div>
                </Card>
            </div>
            <Card className="col-span-2 p-[18px]">
                <Typography.Title level={3}>Danh sách các mặt hàng cung cấp</Typography.Title>
                <p className="text-justify">
                    Hiển thị dạng bảng?
                </p>
            </Card>
        </div>
    );
};

export default ProviderDetail;