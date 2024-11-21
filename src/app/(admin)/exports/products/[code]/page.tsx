'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useImportProductByCode } from '@/modules/exports/products/repository';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { ExportProductStatusVietnamese, ExportProductTypeVietnamese } from '@/modules/exports/products/interface';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatNumberToCurrency } from '@/utils/formatNumber';

const ExportProductDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: exportProduct, isLoading } = useImportProductByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!exportProduct) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã phiếu xuất</div>
                    <div className="text-brand-500">#{exportProduct.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="col-span-1 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Người lập phiếu"
                                  value={exportProduct.creator.fullName || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Ngày lập phiếu" value={formatDateToLocalDate(exportProduct.createdAt)} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Loại giao dịch"
                                  value={ExportProductTypeVietnamese[exportProduct.type]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái"
                                  value={ExportProductStatusVietnamese[exportProduct.status]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Ghi chú" value={exportProduct.note || ''} />
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
                {/*<Typography.Title level={3}>Danh sách thành phẩm</Typography.Title>*/}
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã đơn hàng</div>
                    <div className="text-brand-500">#DH15112400001</div>
                </div>
                <div className="">
                    <TableCore>
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head>SKU</TableCore.Head>
                                <TableCore.Head>Thành phẩm</TableCore.Head>
                                <TableCore.Head>Kho</TableCore.Head>
                                <TableCore.Head>Ngày hết hạn</TableCore.Head>
                                <TableCore.Head>Đơn giá</TableCore.Head>
                                <TableCore.Head>Số lượng</TableCore.Head>
                                <TableCore.Head>Thành tiền</TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>
                        <TableCore.Body>
                            {
                                exportProduct.details.map((detail, index) => (
                                    <React.Fragment key={`detail-${index}`}>
                                        <TableCore.RowBody>
                                            <TableCore.Cell>
                                                <div>
                                                    <div>{detail.product.sku}</div>
                                                </div>
                                            </TableCore.Cell>
                                            <TableCore.Cell>
                                                <div className="flex gap-2">
                                                    <div className="relative h-14 w-14 p-1 rounded shadow">
                                                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh của sản phẩm `}
                                                               fill
                                                               className="object-cover" />
                                                    </div>
                                                    <div className="flex-col flex justify-center">
                                                        <div className="font-medium">{detail.product.name}</div>
                                                        <div
                                                            className="text-gray-800">{detail.product.weight}{detail.product.unit} - {detail.product.packing}</div>
                                                    </div>
                                                </div>
                                            </TableCore.Cell>
                                            <TableCore.Cell>
                                                <div>
                                                    <div>Kho lạnh lẽo</div>
                                                    <div>#KHO123</div>
                                                </div>
                                            </TableCore.Cell>
                                            <TableCore.Cell>{formatDateToLocalDate(new Date())}</TableCore.Cell>
                                            <TableCore.Cell>{formatNumberToCurrency(detail.price)}</TableCore.Cell>
                                            <TableCore.Cell>{detail.quantity}</TableCore.Cell>
                                            <TableCore.Cell>{formatNumberToCurrency(detail.price * detail.quantity)}</TableCore.Cell>
                                        </TableCore.RowBody>

                                        <TableCore.RowBody>
                                            <TableCore.Cell />
                                            <TableCore.Cell />
                                            <TableCore.Cell>
                                                <div>
                                                    <div>Kho lạnh lẽo</div>
                                                    <div>#KHO124</div>
                                                </div>
                                            </TableCore.Cell>
                                            <TableCore.Cell>{formatDateToLocalDate(new Date())}</TableCore.Cell>
                                            <TableCore.Cell>{formatNumberToCurrency(detail.price)}</TableCore.Cell>
                                            <TableCore.Cell>{detail.quantity}</TableCore.Cell>
                                            <TableCore.Cell>{formatNumberToCurrency(detail.price * detail.quantity)}</TableCore.Cell>
                                        </TableCore.RowBody>

                                        <TableCore.RowBody className="font-bold">
                                            <TableCore.Cell>Tổng</TableCore.Cell>
                                            <TableCore.Cell />
                                            <TableCore.Cell />
                                            <TableCore.Cell />
                                            <TableCore.Cell />
                                            <TableCore.Cell>{detail.quantity}</TableCore.Cell>
                                            <TableCore.Cell>{formatNumberToCurrency(detail.price * detail.quantity)}</TableCore.Cell>
                                        </TableCore.RowBody>
                                    </React.Fragment>
                                ))
                            }
                        </TableCore.Body>
                    </TableCore>
                </div>
            </Card>
        </div>
    );
};

export default ExportProductDetail;