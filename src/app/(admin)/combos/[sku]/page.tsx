import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';

const ComboDetail = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã sản phẩm</div>
                    <div className="text-brand-500">#HQT240001</div>
                </div>
            </Card>

            <div className="grid grid-cols-4 gap-4">
                <Card className="p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={avatar} alt={""} fill className="object-cover" />
                    </div>
                </Card>
                <Card className="col-span-3 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo label="Tên sản phẩm" value="Hộp quà tết An Khang 1" />
                        <ItemInfo label="Giá hiện tại" value="1.199.000 VND" />
                        <ItemInfo label="Trạng thái" value="Đang hoạt động" />
                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Thành phần</Typography.Title>
                <p className="">
                    Bảng danh sách các thành phânf có trong Set quà!
                </p>
            </Card>

            <Card className="p-[18px] text-justify">
                <Typography.Title level={3}>Mô tả</Typography.Title>
                <p className="">
                    Hộp quà tết An Khang 1 có sự kết hợp tinh tế và hoàn hảo từ vỏ hộp gỗ đến các hũ thủy tinh
                    đựng hạt bên trong, từ sự chăm chút trong thiết kế đến chất lượng của các loại hạt dinh dưỡng
                    thượng hạng được Nut Corner dụng công lựa chọn.
                </p>
                <p className="">
                    Hộp quà tết An Khang 1 tạo điểm nhấn với vỏ hộp làm từ chất liệu gỗ tự nhiên, thiết kế dạng nắp
                    trượt thông minh và in hình chìm, màu sắc rực rỡ, tươi sáng, đậm đà sắc xuân. Hộp gỗ chắc chắn giúp
                    cố định các hũ đựng hạt thủy tinh bên trong, vừa giúp bảo vệ các hũ đựng vừa tạo nên sự sang trọng,
                    độc đáo riêng cho hộp quà tết An Khang 1.
                </p>
            </Card>
        </div>
    );
};

export default ComboDetail;