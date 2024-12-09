'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useOrderByCode } from '@/modules/orders/repository';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { OrderStatusVietnamese } from '@/components/Badge/OrderStatusBadge';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { PaymentMethodVietnamese } from '@/components/Badge/PaymentMethod';
import { PaymentStatusVietnamese } from '@/components/Badge/PaymentStatusBadge';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { ceil, sumBy } from 'lodash';

const OrderDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: order, isLoading } = useOrderByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!order) {
        return <NotFound />;
    }

    const { customer } = order;
    const totalProductPrice = sumBy(order.orderDetails, detail => detail.price * detail.quantity) || 0;
    const totalDiscount = ceil(order.totalPrice * order.discountPercent / 100, -3) || 0;

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã đơn hàng</div>
                    <div className="text-brand-500">#{order.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <div className="flex flex-col gap-4">
                        <Card className="p-[18px]">
                            <Typography.Title level={3}>Thông tin khách hàng</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Tên"
                                          value={customer.name || 'Chưa cập nhật'} />
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Số điện thoại" value={`${customer.phone}`} />
                                <ItemInfo gridColumns="grid-cols-5"
                                          colSpan1="col-span-2"
                                          colSpan2="col-span-3"
                                          label="Địa chỉ"
                                          value={
                                              customer.address && customer.ward && customer.district && customer.city
                                                  ? `${customer.address}, ${customer.ward.split(' - ')[0]}, ${customer.district.split(' - ')[0]}, ${customer.city.split(' - ')[0]}`
                                                  : 'Chưa cập nhật'
                                          }
                                />
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Email"
                                          value={customer.email || 'Chưa cập nhật'} />
                            </div>
                        </Card>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-4">
                        <Card className=" p-[18px]">
                            <Typography.Title level={3}>Lịch sử đặt hàng</Typography.Title>
                            <div className="flex flex-col gap-3">
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Ngày đặt" value={formatDateToLocalDate(order.orderDate)} />
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Ngày giao" value={formatDateToLocalDate(order.deliveryDate)} />
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Trạng thái" value={OrderStatusVietnamese[order.status]} />
                                <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                          label="Ghi chú" value={order.note || ''} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Chi tiết đơn hàng</Typography.Title>
                <div className="">
                    <TableCore>
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head>Sản phẩm</TableCore.Head>
                                <TableCore.Head>Giá</TableCore.Head>
                                <TableCore.Head>Số lượng</TableCore.Head>
                                <TableCore.Head>Thành tiền</TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>
                        <TableCore.Body>
                            {
                                order.orderDetails.map((detail, index) => (
                                    <TableCore.RowBody key={`detail-${index}`}>
                                        <TableCore.Cell>
                                            <div className="flex gap-2">
                                                <div className="relative h-14 w-14 p-1 rounded shadow">
                                                    <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh của sản phẩm `} fill
                                                           className="object-cover" />
                                                </div>
                                                <div className="flex-col flex justify-center">
                                                    <div className="font-medium">{detail.product.name}</div>
                                                    <div className="text-gray-800">{detail.product.weight}{detail.product.unit} - {detail.product.packing}</div>
                                                </div>
                                            </div>
                                        </TableCore.Cell>
                                        <TableCore.Cell>{formatNumberToCurrency(detail.price)}</TableCore.Cell>
                                        <TableCore.Cell>{detail.quantity}</TableCore.Cell>
                                        <TableCore.Cell>{formatNumberToCurrency(detail.price * detail.quantity)}</TableCore.Cell>
                                    </TableCore.RowBody>
                                ))
                            }
                        </TableCore.Body>
                    </TableCore>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-[18px]">
                    <Typography.Title level={3}>Nhận hàng và Vận chuyển</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5"
                                  colSpan1="col-span-2"
                                  colSpan2="col-span-3"
                                  label="Tên người nhận"
                                  value={customer.name || 'Chưa cập nhật'}
                        />
                        <ItemInfo gridColumns="grid-cols-5"
                                  colSpan1="col-span-2"
                                  colSpan2="col-span-3"
                                  label="Số điện thoại"
                                  value={order.phone}
                        />
                        <ItemInfo gridColumns="grid-cols-5"
                                  colSpan1="col-span-2"
                                  colSpan2="col-span-3"
                                  label="Địa chỉ"
                                  value={order.address && order.city && order.district && order.ward ? `${order.address}, ${order.ward.split(' - ')[0]}, ${order.district.split(' - ')[0]}, ${order.city.split(' - ')[0]}` : 'Chưa cập nhật'} />
                    </div>
                </Card>
                <Card className=" p-[18px] text-base">
                    <Typography.Title level={3}>Thanh toán</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Hình thức thanh toán"
                                  value={PaymentMethodVietnamese[order.paymentMethod]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái thanh toán"
                                  value={PaymentStatusVietnamese[order.paymentStatus]} />
                        <ItemInfo gridColumns="grid-cols-5"
                                  colSpan1="col-span-2"
                                  colSpan2="col-span-3"
                                  label="Tổng tiền sản phẩm"
                                  value={formatNumberToCurrency(totalProductPrice)}
                        />
                        <ItemInfo gridColumns="grid-cols-5"
                                  colSpan1="col-span-2"
                                  colSpan2="col-span-3"
                                  label="Phí vận chuyển"
                                  value={formatNumberToCurrency(order.shippingFee)}
                        />
                        <ItemInfo gridColumns="grid-cols-5"
                                  colSpan1="col-span-2"
                                  colSpan2="col-span-3"
                                  label="Chiếc khẩu"
                                  value={`${order.discountPercent}% (${formatNumberToCurrency(totalDiscount)})`}
                        />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Thành tiền" value={formatNumberToCurrency(order.totalPrice)} />
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default OrderDetail;