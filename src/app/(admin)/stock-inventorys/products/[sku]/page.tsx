import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';

const StockInventoryProductDetail = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã nguyên vật liệu</div>
                    <div className="text-brand-500">#NVL201001</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Người thực hiện" value="Nguyễn Thị Thu Ngân" />
                        <ItemInfo label="Ngày thực hiện" value="10/10/2024" />
                        <ItemInfo label="Lý do" value="Kiểm kê định kì" />
                        <ItemInfo label="Trạng thái" value="Hoàn thành, Phiếu tạm, Tạm thời" />
                        <ItemInfo label="Ghi chú" value="Ghi chú ..." />
                    </div>
                </Card>
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Khu vực kiểm kê</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Mã khu vực" value="KV0001" />
                        <ItemInfo label="Tên khu vực" value="Kho lạnh - Khu A - Phòng 1 - Kệ 3" />
                        <ItemInfo label="Trạng thái" value="Đang hoạt động" />

                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Mô tả</Typography.Title>
                <p className="">
                    Hiển thị sl ht, tt, ...
                    Mã nguyên vật liệu, tên, khối lượng, đóng gói, SL ht, SL tt, Chênh lệch, tồn kho
                    Nguyên nhân, Ghi chú
                </p>
            </Card>

        </div>
    );
};

export default StockInventoryProductDetail;