import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
const OrderDetail = () => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã đơn hàng</div>
                    <div className="text-brand-500">#HD00001</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <div className="flex flex-col gap-4">
                        <Card className="p-[18px]">
                            <Typography.Title level={3}>Thông tin khách hàng</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <ItemInfo label="Tên" value="Trần Thị Kim Châu" />
                                <ItemInfo label="Số điện thoại" value="0356716656" />
                                <ItemInfo label="Địa chỉ" value="40a Lam Sơn, phường 2, quận Tân Bình" />
                                <ItemInfo label="Email" value="chautrantitancorpvn.com" />
                            </div>
                        </Card>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-4">
                        <Card className=" p-[18px]">
                            <Typography.Title level={3}>Lịch sử đặt hàng</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <ItemInfo label="Ngày đặt" value="21/10/2024" />
                                <ItemInfo label="Ngày giao" value="25/10/2024" />
                                <ItemInfo label="Ngày nhận hàng" value="25/10/2024" />
                                <ItemInfo label="Trạng thái" value="Hoàn thành" />
                                <ItemInfo label="Ghi chú" value="Giao hàng giờ hành chính." />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Chi tiết đơn hàng</Typography.Title>
                <p className="">
                    Bảng danh sách chi tiết các sản phẩm
                </p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <div className="flex flex-col gap-4">
                        <Card className="p-[18px]">
                            <Typography.Title level={3}>Nhận hàng và Vận chuyển</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <ItemInfo label="Hình thức" value="Tự nhận" />
                                <ItemInfo label="Tên người nhận" value="Thu Ngân" />
                                <ItemInfo label="Số điện thoại" value="0356716656" />
                                <ItemInfo label="Địa chỉ" value="40a Lam Sơn, phường 2, quận Tân Bình" />
                                <ItemInfo label="Phí vận chuyển" value="25.000 VND" />
                                <ItemInfo label="Thuế VAT" value="10%" />
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex flex-col gap-4">
                        <Card className=" p-[18px] text-base">
                            <Typography.Title level={3}>Thanh toán</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <ItemInfo label="Hình thức thanh toán" value="Tiền mặt" />
                                <ItemInfo label="Tổng tiền sản phẩm" value="5.000.000 VND" />
                                <ItemInfo label="Phí vận chuyển" value="35.000 VND" />
                                <ItemInfo label="Thuế VAT" value="500.000 VND" />
                                <ItemInfo label="Thanh toán" value="5.535.000 VND" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OrderDetail;