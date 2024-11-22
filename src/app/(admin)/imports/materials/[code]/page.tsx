'use client';

import React from 'react';
import Card from '@/components/Card';
import Typography from '@/components/Typography';
import ItemInfo from '@/components/ItemInfo';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import { useImportMaterialByCode } from '@/modules/imports/materials/repository';
import { ImportMaterialStatusVietnamese, ImportMaterialTypeVietnamese } from '@/modules/imports/materials/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';
import TableCore from '@/components/Tables/TableCore';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatNumberToCurrency } from '@/utils/formatNumber';

const ImportMaterialDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: importMaterial, isLoading } = useImportMaterialByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!importMaterial) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <Card className="p-[18px]">
                <div className="flex gap-1 text-xl font-nunito font-medium">
                    <div>Mã phiếu nhập</div>
                    <div className="text-brand-500">#{importMaterial.code}</div>
                </div>
            </Card>

            <div className="grid grid-cols-5 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={avatar} alt={''} fill className="object-cover" />
                    </div>
                </Card>
                <div className="col-span-3">
                    <Card className="p-[18px]">
                        <Typography.Title level={3}>Thông tin chung</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Người lập phiếu"
                                      value={importMaterial.creator.fullName || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Ngày lập phiếu" value={formatDateToLocalDate(importMaterial.createdAt)} />
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
                    <Card className="p-[18px] mt-4">
                        <Typography.Title level={3}>Thông tin nhà cung cấp</Typography.Title>
                        <div className="flex flex-col gap-3">
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Mã nhà cung cấp" value={importMaterial.provider.code || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Tên nhà cung cấp"
                                      value={importMaterial.provider.name || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Số điện thoại" value={importMaterial.provider.phone || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Email" value={importMaterial.provider.email || 'Chưa cập nhật'} />
                            <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                      label="Địa chỉ"
                                      value={`${importMaterial.provider.address}, ${importMaterial.provider.ward}, ${importMaterial.provider.district}, ${importMaterial.provider.city}`} />
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
                            {
                                importMaterial.details.map((detail, index) => (
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

export default ImportMaterialDetail;