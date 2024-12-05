'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useExportProductByCode } from '@/modules/exports/products/repository';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { ExportProductStatusVietnamese, ExportProductTypeVietnamese } from '@/modules/exports/products/interface';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { groupBy, map, sumBy } from 'lodash';

const ExportProductDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: exportProduct, isLoading } = useExportProductByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!exportProduct) {
        return <NotFound />;
    }

    const renderProductDetail = () => {
        const groupedDetails = groupBy(exportProduct.details, detail => `${detail.product.sku}-${detail.expiryDate}`);

        return map(groupedDetails, (details, key) => {
            const firstDetail = details[0];
            const totalQuantity = sumBy(details, 'quantity');

            return (
                <React.Fragment key={key}>
                    <TableCore.RowBody>
                        <TableCore.Cell>
                            <div>
                                <div>{firstDetail.product.sku}</div>
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
                                    <div className="font-medium">{firstDetail.product.name}</div>
                                    <div
                                        className="text-gray-800">{firstDetail.product.packing} - {firstDetail.product.weight}{firstDetail.product.unit}</div>
                                </div>
                            </div>
                        </TableCore.Cell>
                        <TableCore.Cell>
                            <div>
                                <div>{firstDetail.storageArea.name}</div>
                                <div>#{firstDetail.storageArea.code}</div>
                            </div>
                        </TableCore.Cell>
                        <TableCore.Cell>{formatDateToLocalDate(firstDetail.expiryDate)}</TableCore.Cell>
                        <TableCore.Cell>{firstDetail.quantity}</TableCore.Cell>
                    </TableCore.RowBody>

                    {
                        details.splice(1).map((detail, index) => (
                            <TableCore.RowBody key={`${key}-${index}`}>
                                <TableCore.Cell />
                                <TableCore.Cell />
                                <TableCore.Cell>
                                    <div>
                                        <div>{detail.storageArea.name}</div>
                                        <div>#{detail.storageArea.code}</div>
                                    </div>
                                </TableCore.Cell>
                                <TableCore.Cell>{formatDateToLocalDate(detail.expiryDate)}</TableCore.Cell>
                                <TableCore.Cell>{detail.quantity}</TableCore.Cell>
                            </TableCore.RowBody>
                        ))
                    }

                    <TableCore.RowBody className="font-bold">
                        <TableCore.Cell>Tổng</TableCore.Cell>
                        <TableCore.Cell />
                        <TableCore.Cell />
                        <TableCore.Cell />
                        <TableCore.Cell>{totalQuantity}</TableCore.Cell>
                    </TableCore.RowBody>
                </React.Fragment>
            );
        });
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã phiếu xuất</div>
                    <div className="text-brand-500">#{exportProduct.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-[18px]">
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
                <Card className="p-[18px]">
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
                <Typography.Title level={3}>Danh sách thành phẩm</Typography.Title>
                <div className="">
                    <TableCore>
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head>SKU</TableCore.Head>
                                <TableCore.Head>Thành phẩm</TableCore.Head>
                                <TableCore.Head>Kho</TableCore.Head>
                                <TableCore.Head>Ngày hết hạn</TableCore.Head>
                                <TableCore.Head>Số lượng</TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>
                        <TableCore.Body>
                            {renderProductDetail()}
                        </TableCore.Body>
                    </TableCore>
                </div>
            </Card>
        </div>
    );
};

export default ExportProductDetail;