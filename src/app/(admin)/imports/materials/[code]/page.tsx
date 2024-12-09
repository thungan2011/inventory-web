'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import {
    useApproveImportMaterial,
    useImportMaterialByCode,
    useRejectImportMaterial,
} from '@/modules/imports/materials/repository';
import {
    ImportMaterialStatus,
    ImportMaterialStatusVietnamese,
    ImportMaterialTypeVietnamese,
} from '@/modules/imports/materials/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';
import TableCore from '@/components/Tables/TableCore';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { groupBy, map, sumBy } from 'lodash';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';

const ImportMaterialDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: importMaterial, isLoading } = useImportMaterialByCode(code);
    const approveImportMaterial = useApproveImportMaterial();
    const rejectImportMaterial = useRejectImportMaterial();

    if (isLoading) {
        return <Loader />;
    }

    if (!importMaterial) {
        return <NotFound />;
    }


    const renderMaterialDetail = () => {
        const groupedDetails = groupBy(importMaterial.details, detail => `${detail.material.sku}-${detail.expiryDate}`);

        return map(groupedDetails, (details, key) => {
            const firstDetail = details[0];
            const totalQuantity = sumBy(details, 'quantity');
            const totalPrice = sumBy(details, detail => detail.quantity * detail.price);

            return (
                <React.Fragment key={key}>
                    <TableCore.RowBody>
                        <TableCore.Cell>
                            <div>
                                <div>{firstDetail.material.sku}</div>
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
                                    <div className="font-medium">{firstDetail.material.name}</div>
                                    <div
                                        className="text-gray-800">{firstDetail.material.weight}{firstDetail.material.unit} - {firstDetail.material.packing}</div>
                                </div>
                            </div>
                        </TableCore.Cell>
                        <TableCore.Cell>
                            <div>
                                <div>{firstDetail.storageArea.name}</div>
                                <div>#{firstDetail.storageArea.code}</div>
                            </div>
                        </TableCore.Cell>
                        <TableCore.Cell>{formatDateToLocalDate(new Date())}</TableCore.Cell>
                        <TableCore.Cell>{formatNumberToCurrency(firstDetail.price)}</TableCore.Cell>
                        <TableCore.Cell>{firstDetail.quantity}</TableCore.Cell>
                        <TableCore.Cell>{formatNumberToCurrency(firstDetail.price * firstDetail.quantity)}</TableCore.Cell>
                    </TableCore.RowBody>

                    {
                        details.slice(1).map((detail, index) => (
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
                                <TableCore.Cell>{formatNumberToCurrency(detail.price)}</TableCore.Cell>
                                <TableCore.Cell>{detail.quantity}</TableCore.Cell>
                                <TableCore.Cell>{formatNumberToCurrency(detail.price * detail.quantity)}</TableCore.Cell>
                            </TableCore.RowBody>
                        ))
                    }

                    <TableCore.RowBody className="font-bold">
                        <TableCore.Cell>Tổng</TableCore.Cell>
                        <TableCore.Cell />
                        <TableCore.Cell />
                        <TableCore.Cell />
                        <TableCore.Cell />
                        <TableCore.Cell>{totalQuantity}</TableCore.Cell>
                        <TableCore.Cell>{formatNumberToCurrency(totalPrice)}</TableCore.Cell>
                    </TableCore.RowBody>
                </React.Fragment>
            );
        });
    };

    const handleApproveReceipt = async () => {
        try {
            await approveImportMaterial.mutateAsync(importMaterial.id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRejectReceipt = async () => {
        try {
            await rejectImportMaterial.mutateAsync(importMaterial.id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className={`flex items-center`}>
                    <div className="flex gap-1 text-xl font-nunito font-medium">
                        <div>Mã phiếu nhập</div>
                        <div className="text-brand-500">#{importMaterial.code}</div>
                    </div>

                    {
                        importMaterial.status === ImportMaterialStatus.PENDING_APPROVED && (
                            <div className="flex gap-3 ml-auto">
                                <button
                                    className="bg-red-400 py-2 px-4 rounded flex items-center justify-center text-white gap-x-2 text-sm hover:opacity-80"
                                    onClick={handleRejectReceipt}
                                    type="button">Từ chối
                                </button>
                                <button
                                    className="bg-brand-500 py-2 px-4 rounded flex items-center justify-center text-white gap-x-2 text-sm hover:opacity-80"
                                    onClick={handleApproveReceipt}
                                    type="button">Phê duyệt
                                </button>
                            </div>
                        )
                    }
                </div>
            </Card>

            <div className="grid grid-cols-6 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={''} fill className="object-cover" />
                    </div>
                </Card>
                <div className="col-span-4 space-y-4">
                    <Card className="p-[18px]">
                        <Typography.Title level={3}>Thông tin chung</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Người lập phiếu"
                                      value={importMaterial.creator.fullName || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Ngày lập phiếu" value={formatDateToLocalDate(importMaterial.createdAt)} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Người nhận hàng"
                                      value={importMaterial.receiver.fullName || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Loại giao dịch"
                                      value={ImportMaterialTypeVietnamese[importMaterial.type]} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Trạng thái"
                                      value={ImportMaterialStatusVietnamese[importMaterial.status]} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Ghi chú" value={importMaterial.note || ''} />
                        </div>
                    </Card>
                    <Card className="p-[18px]">
                        <Typography.Title level={3}>Thông tin nhà cung cấp</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Mã nhà cung cấp" value={importMaterial?.provider?.code || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Tên nhà cung cấp"
                                      value={importMaterial?.provider?.name || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Số điện thoại" value={importMaterial?.provider?.phone || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Email" value={importMaterial?.provider?.email || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Địa chỉ"
                                      value={`${importMaterial?.provider?.address}, ${importMaterial?.provider?.ward}, ${importMaterial?.provider?.district}, ${importMaterial?.provider?.city}`} />
                        </div>
                    </Card>
                </div>

            </div>

            <Card className="p-[18px]">
                <Typography.Title level={3}>Danh sách nguyên vật liệu</Typography.Title>
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
                            {renderMaterialDetail()}
                        </TableCore.Body>
                    </TableCore>
                </div>
            </Card>
        </div>
    );
};

export default ImportMaterialDetail;