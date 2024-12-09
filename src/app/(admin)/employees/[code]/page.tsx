'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useEmployeeByCode } from '@/modules/employees/repository';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { EmployeeStatusVietnamese } from '@/components/Badge/EmployeeStatusBadge';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatGender } from '@/utils/formatString';

const EmployeeDetail = () => {

    const { code } = useParams<{ code: string }>();
    const { data: employee, isLoading } = useEmployeeByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!employee) {
        return <NotFound />;
    }
    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã khách hàng</div>
                    <div className="text-brand-500">#{employee.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-4 gap-4">
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh của ${employee.lastName}`} fill
                               className="object-cover" />
                    </div>
                </Card>
                <Card className="col-span-3 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Tên" value={`${employee.firstName} ${employee.lastName}`} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Sinh nhật"
                                  value={employee.birthday ? formatDateToLocalDate(employee.birthday) : 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Giới tính" value={formatGender(employee.gender)} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Số điện thoại"
                                  value={employee.phone} />
                        <ItemInfo
                            gridColumns="grid-cols-5"
                            colSpan1="col-span-2"
                            colSpan2="col-span-3"
                            label="Địa chỉ"
                            value={
                                employee.address || employee.ward || employee.district || employee.city
                                    ? `${employee.address || ''}, ${employee.ward || ''}, ${employee.district || ''}, ${employee.city || ''}`
                                    : 'Chưa cập nhật'
                            }
                        />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3" label="Email"
                                  value={employee.email || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái" value={EmployeeStatusVietnamese[employee.status]} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDetail;