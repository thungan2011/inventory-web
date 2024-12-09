import React from 'react';
import Modal from '@/components/Modal';
import ButtonAction from '@/components/ButtonAction';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatAddress, formatRole } from '@/utils/formatString';
import { EmployeeOverview } from '@/modules/employees/interface';
import ItemInfo from '@/components/ItemInfo';
import { formatDateToLocalDate } from '@/utils/formatDate';

type ModalEmployeeDetailProps = {
    onClose: () => void;
    employee: EmployeeOverview;
}

const ModalEmployeeDetail = ({ onClose, employee }: ModalEmployeeDetailProps) => {
    return (
        <Modal title="Thông tin nhân viên" open={true} onClose={onClose} className="!w-5/12">
            <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col mt-5 items-center">
                    <div className="relative aspect-square border rounded-full shadow overflow-hidden col-span-1 w-32">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh nhân viên`} fill
                               className="object-cover" />
                    </div>
                    <p className="mt-2">{formatRole(employee.roleName)}</p>
                </div>
                <div className="col-span-3 space-y-3">
                    <ItemInfo label="Họ đệm" value={employee.firstName} />
                    <ItemInfo label="Tên" value={employee.lastName} />
                    <ItemInfo label="Sinh nhật" value={formatDateToLocalDate(employee.birthday)} />
                    <ItemInfo label="Số điện thoại" value={employee.phone || 'Chưa cập nhật'} />
                    <ItemInfo label="Email" value={employee.user.email} />
                    <ItemInfo label="Địa chỉ"
                              value={employee.address && employee.ward && employee.district && employee.city && formatAddress(employee.address, employee.ward, employee.district, employee.city) || 'Chưa cập nhật'} />
                    <div className="flex justify-end items-center gap-3 mt-3">
                        <ButtonAction.Cancel onClick={onClose} text="Đóng" />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalEmployeeDetail;