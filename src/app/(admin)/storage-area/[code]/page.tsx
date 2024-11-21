'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { formatDateToLocalDate } from '@/utils/formatDate';
import TableCore from '@/components/Tables/TableCore';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { useStorageAreaByCode } from '@/modules/storage-area/repository';
import { StorageAreaStatusVietnamese } from '@/components/Badge/StorageAreaStatusBadge';

const StorageAreaDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: storageArea, isLoading } = useStorageAreaByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!storageArea) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã khu vực lưu trữ</div>
                    <div className="text-brand-500">#{storageArea.code}</div>
                </div>
            </Card>

            <div>
                <div>
                    <Card className="p-[18px]">
                        <Typography.Title level={3}>Thông tin chung</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Tên khu vực lưu trữ"
                                      value={storageArea.name || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Trạng thái"
                                      value={StorageAreaStatusVietnamese[storageArea.status]} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Mô tả" value={storageArea.description || ''} />
                        </div>
                    </Card>
                </div>

            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Danh sách nguyên vật liệu/thành phẩm</Typography.Title>
                <div className="">
                    <TableCore>
                        <TableCore.Header>
                            <TableCore.RowHeader>
                                <TableCore.Head>SKU</TableCore.Head>
                                <TableCore.Head>Tên</TableCore.Head>
                                <TableCore.Head>Ngày hết hạn</TableCore.Head>
                                <TableCore.Head>SL sẳn có</TableCore.Head>
                            </TableCore.RowHeader>
                        </TableCore.Header>
                        <TableCore.Body>
                            {
                                storageArea.productStorageHistories.map((detail, index) => (
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
                                                            className="text-gray-800">{detail.product.name}{detail.product.name}</div>
                                                    </div>
                                                </div>
                                            </TableCore.Cell>
                                            <TableCore.Cell>{formatDateToLocalDate(new Date(detail.expiryDate))}</TableCore.Cell>
                                            <TableCore.Cell>{detail.quantityAvailable}</TableCore.Cell>
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

export default StorageAreaDetail;