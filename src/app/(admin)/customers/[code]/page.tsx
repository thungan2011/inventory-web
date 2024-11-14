'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useCustomerByCode } from '@/modules/customers/repository';
import { CustomerStatusVietnamese } from '@/components/Badge/CustomerStatusBadge';
import { GenderStatusVietnamese } from '@/components/Badge/GenderStatusBadge';
import { formatDateToLocalDate } from '@/utils/formatDate';

const CustomerDetail = () => {

    const { code } = useParams<{ code: string }>();
    const { data: customer, isLoading } = useCustomerByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!customer) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã khách hàng</div>
                    <div className="text-brand-500">#{customer.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Tên"
                                  value={customer.name} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Sinh nhật"
                                  value={customer.birthday ? formatDateToLocalDate(customer.birthday) : 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Giới tính" value={GenderStatusVietnamese[customer.gender]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Số điện thoại"
                                  value={customer.phone} />
                        <ItemInfo
                            gridColumns="grid-cols-5"
                            colSpan1="col-span-2"
                            colSpan2="col-span-3"
                            label="Địa chỉ"
                            value={
                                customer.address || customer.ward || customer.district || customer.city
                                    ? `${customer.address || ''}, ${customer.ward || ''}, ${customer.district || ''}, ${customer.city || ''}`
                                    : 'Chưa cập nhật'
                            }
                        />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Email"
                                  value={customer.email || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái" value={CustomerStatusVietnamese[customer.status]} />
                    </div>
                </Card>
                <Card className="p-[18px]">
                    <Typography.Title level={3}>Ghi chú</Typography.Title>
                    <p>{customer.note || 'Chưa cập nhật'}</p>
                </Card>
            </div>
        </div>
    );
};

export default CustomerDetail;