import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';

const ImportMaterialDetail = () => {
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
                        <Image src={avatar} alt={""} fill className="object-cover" />
                    </div>
                </Card>
                <div className="col-span-3">
                    <Card className="p-[18px]">
                        <Typography.Title level={3}>Thông tin chung</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo label="Người lập phiếu" value="Chu Ngọc Anh" />
                            <ItemInfo label="Ngày lập phiếu" value="03/10/2024" />
                            <ItemInfo label="Người nhận" value="Nguyễn Thị Kim Xuân" />
                            <ItemInfo label="Ngày nhận" value="03/10/2024" />
                            <ItemInfo label="Trạng thái" value="Hoàn tất" />
                        </div>
                    </Card>
                    <Card className="p-[18px] mt-4">
                        <Typography.Title level={3}>Thông tin nhà cung cấp</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo label="Mã nhà cung cấp" value="NCC001" />
                            <ItemInfo label="Tên nhà cung cấp" value="Việt Tâm Anh" />
                            <ItemInfo label="Số điện thoại" value="0891234567" />
                            <ItemInfo label="Email" value="viettamanh123@gmail.com" />
                            <ItemInfo label="Địa chỉ" value="A75/18 Bạch Đằng, phường 2, quận Tân Bình, TP Hồ Chí Minh" />
                        </div>
                    </Card>
                </div>

            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Danh sách nguyên vật liệu</Typography.Title>
                <p className="">
                   Bảng danh sách nguyên vật liệu: tên, mã, đơn vị tính, số lượng, khối lượng, đơn giá, thành tiền,
                    hạn sử dụng, ngày sản xuất, vị trí lưu trữ
                </p>
            </Card>
        </div>
    );
};

export default ImportMaterialDetail;