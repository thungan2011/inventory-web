import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';

const ImportProductDetail = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã phiếu nhập</div>
                    <div className="text-brand-500">#MPN240001</div>
                </div>
            </Card>
            <div className="grid grid-cols-5 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={avatar} alt={''} fill className="object-cover" />
                    </div>
                </Card>
                <Card className="col-span-3 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Người lập phiếu" value="Nguyễn Thị Kim Xuân" />
                        <ItemInfo label="Ngày lập phiếu" value="03/10/2024" />
                        <ItemInfo label="Người nhập kho" value="Nguyễn Thị Kim Xuân" />
                        <ItemInfo label="Ngày nhập kho" value="03/10/2024" />
                        <ItemInfo label="Trạng thái" value="Hoàn tất" />
                        <ItemInfo label="Ghi chú" value="Ghi chú, ghi chú, ghi chú, ghi chú, ghi chú" />
                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Danh sách nguyên vật liệu</Typography.Title>
                <p className="">
                    Bảng danh sách các thành phẩm: tên, mã, đơn vị tính, số lượng, khối lượng, đóng gói, xuất xứ,
                    hạn sử dụng, ngày đóng gói, vị trí lưu trữ
                </p>
            </Card>
        </div>
    );
};

export default ImportProductDetail;