import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';

const WarehouseAreaProductDetail = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Thông tin nguyên vật liệu</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="SKU" value="NVL001" />
                        <ItemInfo label="Tên nguyên vật liệu" value="Hạt Macca vỏ nguyên chất" />
                        <ItemInfo label="Danh mục" value="Hạt dinh dưỡng" />
                        <ItemInfo label="Nhập khẩu" value="Úc" />
                        <ItemInfo label="Khối lượng" value="500g" />
                        <ItemInfo label="Quy cách đóng gói" value="Túi zip" />
                        <ItemInfo label="Thời gian sử dụng" value="3 tháng" />
                        <ItemInfo label="Số lượng sẳn có" value="125" />
                        <ItemInfo label="Số lượng tối thiểu" value="30" />
                        <ItemInfo label="Số lượng tối đa" value="500" />
                        <ItemInfo label="Trạng thái" value="Đang hoạt động" />
                        <ItemInfo label="Ghi chú" value="Ghi chú, ghi chú, ghi chú" />
                    </div>
                </Card>
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Thông tin khu vực lưu trữ</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Mã khu vực" value="KVK0001" />
                        <ItemInfo label="Tên khu vực" value="Kho lạnh - Tầng 1 - Khu A - Phòng 1 - Kệ 4" />
                        <ItemInfo label="Trạng thái" value="Đang hoạt động" />
                        <ItemInfo label="Mô tả" value="Đang hoạt động, Đang hoạt động, Đang hoạt động" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default WarehouseAreaProductDetail;