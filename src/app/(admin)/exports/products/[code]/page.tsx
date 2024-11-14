import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';

const ExportProductDetail = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã phiếu xuất</div>
                    <div className="text-brand-500">#MPX240001</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Người lập phiếu" value="Chu Ngọc Anh" />
                        <ItemInfo label="Ngày lập phiếu" value="03/10/2024" />
                        <ItemInfo label="Trạng thái" value="Hoàn tất" />
                    </div>
                </Card>
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Thông tin khách hàng</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Mã khách hàng" value="NCC001" />
                        <ItemInfo label="Tên khách hàng" value="Việt Tâm Anh" />
                        <ItemInfo label="Số điện thoại" value="0891234567" />
                        <ItemInfo label="Địa chỉ" value="A75/18 Bạch Đằng, phường 2, quận Tân Bình, TP Hồ Chí Minh" />
                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Chi tiết đơn hàng</Typography.Title>
                <p className="">
                    Mã đơn hàng: DH0001
                    Bảng danh sách nguyên vật liệu: tên, mã, đơn vị tính, số lượng, khối lượng, đơn giá, thành tiền,
                    hạn sử dụng, ngày sản xuất, vị trí lưu trữ
                </p>
            </Card>
        </div>
    );
};

export default ExportProductDetail;