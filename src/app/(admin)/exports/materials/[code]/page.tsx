'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useExportMaterialByCode } from '@/modules/exports/materials/repository';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { ExportMaterialStatusVietnamese, ExportMaterialTypeVietnamese } from '@/modules/exports/materials/interface';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatNumberToCurrency } from '@/utils/formatNumber';

const ExportMaterialDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: exportMaterial, isLoading } = useExportMaterialByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!exportMaterial) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã phiếu xuất</div>
                    <div className="text-brand-500">#{exportMaterial.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo
                            label="Người lập phiếu"
                            value={exportMaterial.creator.full_name || 'Chưa cập nhật'} />
                        <ItemInfo
                            label="Ngày lập phiếu" value={formatDateToLocalDate(exportMaterial.createdAt)} />
                        <ItemInfo
                            label="Loại giao dịch"
                            value={ExportMaterialTypeVietnamese[exportMaterial.type]} />
                        <ItemInfo
                            label="Trạng thái"
                            value={ExportMaterialStatusVietnamese[exportMaterial.status]} />
                        <ItemInfo
                            label="Ghi chú" value={exportMaterial.note || ''} />
                    </div>
                </Card>
            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Chi tiết đơn hàng</Typography.Title>
                <div className="">
                    <TableCore>
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head>SKU</TableCore.Head>
                                <TableCore.Head>Nguyên vật liệu</TableCore.Head>
                                <TableCore.Head>Kho</TableCore.Head>
                                <TableCore.Head>Ngày hết hạn</TableCore.Head>
                                <TableCore.Head>Đơn giá</TableCore.Head>
                                <TableCore.Head>Số lượng</TableCore.Head>
                                <TableCore.Head>Thành tiền</TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>
                        <TableCore.Body>
                            {
                                exportMaterial.details.map((detail, index) => (
                                    <React.Fragment key={`detail-${index}`}>
                                        <TableCore.RowBody>
                                            <TableCore.Cell>
                                                <div>
                                                    <div>{detail.material.sku}</div>
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
                                                        <div className="font-medium">{detail.material.name}</div>
                                                        <div
                                                            className="text-gray-800">{detail.material.weight}{detail.material.unit} - {detail.material.packing}</div>
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

export default ExportMaterialDetail;