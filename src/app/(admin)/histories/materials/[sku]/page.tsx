import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';

const StockMaterialDetail = () => {
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
                    <Typography.Title level={3}>Nguyên vật liệu</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Mã nguyên vật liệu" value="MC-001" />
                        <ItemInfo label="Tên nguyên vật liệu" value="Macca-Vỏ" />
                        <ItemInfo label="Khối lượng" value="10kg" />
                        <ItemInfo label="Quy cách đóng gói" value="Thùng" />
                        <ItemInfo label="Ghi chú" value="Ghi chú ..." />
                    </div>
                </Card>
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Thông tin đối chiếu</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Số lượng hệ thống" value="50" />
                        <ItemInfo label="Số lượng thực tế" value="48" />
                        <ItemInfo label="Chênh lệch" value="2" />
                        <ItemInfo label="Số lượng tồn kho" value="48" />
                        <ItemInfo label="Nguyên nhân"
                                  value="Nguyên vật liệu bị ẩm, móc cần tiêu hủy" />
                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Mô tả</Typography.Title>
                <p className="">
                    NVL có thể có nhiều đợt, mỗi đợt tồn lại có 1 thông tin khác nhau
                    Nên hiển thị dạng bảng danh sách để hiển thị thông tin?
                </p>
            </Card>

        </div>
    );
};

export default StockMaterialDetail;