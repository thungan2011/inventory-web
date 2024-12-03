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
import { useImportProductByCode } from '@/modules/imports/products/reponsitory';
import { formatDateToLocalDate } from '@/utils/formatDate';
import { ImportProductStatusVietnamese, ImportProductTypesVietnamese } from '@/modules/imports/products/interface';
import TableCore from '@/components/Tables/TableCore';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { groupBy, map, sumBy } from 'lodash';

const ImportProductDetail = () => {
    const { code } = useParams<{ code: string }>();
    const { data: importProduct, isLoading } = useImportProductByCode(code);

    if (isLoading) {
        return <Loader />;
    }

    if (!importProduct) {
        return <NotFound />;
    }

    const renderProductDetail = () => {
        const groupedDetails = groupBy(importProduct.details, detail => `${detail.product.sku}-${detail.expiryDate}`);

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
                    <div>Mã phiếu nhập</div>
                    <div className="text-brand-500">#{importProduct.code}</div>
                </div>
            </Card>
            <div className="grid grid-cols-6 gap-4">
                <Card className="col-span-2 p-[18px]">
                    <Typography.Title level={3}>Hình ảnh</Typography.Title>
                    <div className="relative aspect-square rounded overflow-hidden">
                        <Image src={avatar} alt={''} fill className="object-cover" />
                    </div>
                </Card>
                <Card className="col-span-4 p-[18px]">
                    <Typography.Title level={3}>Thông tin chung</Typography.Title>
                    <div className="flex flex-col gap-3">
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Người lập phiếu" value={importProduct.creator.full_name || 'Chưa cập nhật'} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Ngày lập phiếu" value={formatDateToLocalDate(importProduct.createdAt)} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Loại giao dịch" value={ImportProductTypesVietnamese[importProduct.type]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Trạng thái" value={ImportProductStatusVietnamese[importProduct.status]} />
                        <ItemInfo gridColumns="grid-cols-5" colSpan1="col-span-2" colSpan2="col-span-3"
                                  label="Ghi chú" value={importProduct.note || ''} />
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
                            {
                                renderProductDetail()
                            }
                            {/*{*/}
                            {/*    importProduct.details.map((detail, index) => (*/}
                            {/*        <React.Fragment key={`detail-${index}`}>*/}
                            {/*            <TableCore.RowBody>*/}
                            {/*                <TableCore.Cell>*/}
                            {/*                    <div>*/}
                            {/*                        <div>{detail.product.sku}</div>*/}
                            {/*                    </div>*/}
                            {/*                </TableCore.Cell>*/}
                            {/*                <TableCore.Cell>*/}
                            {/*                    <div className="flex gap-2">*/}
                            {/*                        <div className="relative h-14 w-14 p-1 rounded shadow">*/}
                            {/*                            <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh của sản phẩm `}*/}
                            {/*                                   fill*/}
                            {/*                                   className="object-cover" />*/}
                            {/*                        </div>*/}
                            {/*                        <div className="flex-col flex justify-center">*/}
                            {/*                            <div className="font-medium">{detail.product.name}</div>*/}
                            {/*                            <div*/}
                            {/*                                className="text-gray-800">{detail.product.weight}{detail.product.unit} - {detail.product.packing}</div>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </TableCore.Cell>*/}
                            {/*                <TableCore.Cell>*/}
                            {/*                    <div>*/}
                            {/*                        <div>{detail.storageArea.name}</div>*/}
                            {/*                        <div>#{detail.storageArea.code}</div>*/}
                            {/*                    </div>*/}
                            {/*                </TableCore.Cell>*/}
                            {/*                <TableCore.Cell>{formatDateToLocalDate(new Date())}</TableCore.Cell>*/}
                            {/*                <TableCore.Cell>{detail.quantity}</TableCore.Cell>*/}
                            {/*            </TableCore.RowBody>*/}

                            {/*            <TableCore.RowBody>*/}
                            {/*                <TableCore.Cell />*/}
                            {/*                <TableCore.Cell />*/}
                            {/*                <TableCore.Cell>*/}
                            {/*                    <div>*/}
                            {/*                        <div>Kho lạnh lẽo</div>*/}
                            {/*                        <div>#KHO124</div>*/}
                            {/*                    </div>*/}
                            {/*                </TableCore.Cell>*/}
                            {/*                <TableCore.Cell>{formatDateToLocalDate(new Date())}</TableCore.Cell>*/}
                            {/*                <TableCore.Cell>{detail.quantity}</TableCore.Cell>*/}
                            {/*            </TableCore.RowBody>*/}

                            {/*            <TableCore.RowBody className="font-bold">*/}
                            {/*                <TableCore.Cell>Tổng</TableCore.Cell>*/}
                            {/*                <TableCore.Cell />*/}
                            {/*                <TableCore.Cell />*/}
                            {/*                <TableCore.Cell />*/}
                            {/*                <TableCore.Cell>{detail.quantity}</TableCore.Cell>*/}
                            {/*            </TableCore.RowBody>*/}
                            {/*        </React.Fragment>*/}
                            {/*    ))*/}
                            {/*}*/}
                        </TableCore.Body>
                    </TableCore>
                </div>
            </Card>
        </div>
    );
};

export default ImportProductDetail;