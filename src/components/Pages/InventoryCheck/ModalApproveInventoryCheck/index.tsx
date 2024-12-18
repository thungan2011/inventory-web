import React from 'react';
import Modal from '@/components/Modal';
import { InventoryCheckOverview } from '@/modules/inventory-checks/interface';
import ItemInfo from '@/components/ItemInfo';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { StorageAreaType } from '@/modules/storage-area/interface';
import { useApproveInventoryCheck } from '@/modules/inventory-checks/repository';

type ModalApproveInventoryCheckProps = {
    onClose: () => void;
    data: InventoryCheckOverview;
}

const ModalApproveInventoryCheck = ({ onClose, data }: ModalApproveInventoryCheckProps) => {
    const approveInventoryCheck = useApproveInventoryCheck();

    const handleApprove = async () => {
        try {
            await approveInventoryCheck.mutateAsync(data.id);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Chi tiết yêu cầu kiểm kê" open={true} onClose={onClose} className="!w-4/12">
            <div className="space-y-2 mt-3">
                <ItemInfo label="Ngày kiểm" value={formatDateToLocalDate(data.checkDate)} />
                <ItemInfo label="Tên kho"
                          value={`${data.storageArea.code} - ${data.storageArea.name} - ${data.storageArea.type === StorageAreaType.PRODUCT ? 'Thành phẩm' : 'Nguyên vật liệu'}`} />
                <ItemInfo label="Ghi chú" value={data.note} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button type="button"
                            className="bg-red-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                        Từ chối
                    </button>
                    <button onClick={handleApprove} type="button"
                            className="bg-brand-500 py-1.5 px-2 rounded flex items-center justify-center text-white gap-x-2 text-sm">
                        Phê duyệt
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalApproveInventoryCheck;