'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import Table from '@/components/Tables';
import { exportToExcel } from '@/utils/exportToExcel';
import Card from '@/components/Card';
import {
    StockInventoryProductOverview,
    StockInventoryProductStatus,
} from '@/modules/stock-inventorys/products/interface';
import StockInventoryProductStatusBadge from '@/components/Badge/StockInventoryProductStatusBadge';
import ButtonAction from '@/components/ButtonAction';
import { formatDateToLocalDate } from '@/utils/formatDate';

const StockInventoryProductPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages] = useState<number>(0);
    const [stockInventoryProducts, setStockInventoryProducts] = useState<StockInventoryProductOverview[]>([]);

    useEffect(() => {
        setStockInventoryProducts([
            {
                id: "345",
                name: "Kho lạnh - Khu A",
                check_date: new Date(),
                check_by: "Chu Ngọc Anh",
                status: StockInventoryProductStatus.INACTIVE,
            }
        ]);
    }, []);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'Nut Garden - Kiểm kê tồn kho';
    }, []);

    const columns = React.useMemo<ColumnDef<StockInventoryProductOverview>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
            },
            {
                accessorKey: 'name',
                header: 'Khu vực ',
            },
            {
                accessorKey: 'check_by',
                header: 'Người thực hiện',
            },
            {
                accessorKey: 'check_date',
                header: () => <span>Ngày thực hiện</span>,
                cell: ({row}) => {
                    return formatDateToLocalDate(row.original.check_date);
                },
            },
            {
                accessorKey: 'status',
                cell: ({ row }) => <StockInventoryProductStatusBadge status={row.original.status}/>,
                header: () => <span>Trạng thái</span>,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/stock-inventorys/products/${row.original.id}`} />
                        <ButtonAction.Update />
                        <ButtonAction.Delete />
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const handleExportExcel = () => {
        exportToExcel<StockInventoryProductOverview>(stockInventoryProducts, [], 'stockInventoryMaterials.xlsx');
    };



    return (
        <>
            <div className="mt-3">
                <Card extra={`mb-5 h-full w-full px-6 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 h-9">
                            <ButtonAction.Add href={'/admin/movies/new'} />
                            <ButtonAction.Import />
                            <ButtonAction.Export onClick={handleExportExcel} />
                        </div>
                    </div>
                </Card>
                <Card className={'py-4'}>
                    <Table<StockInventoryProductOverview> data={stockInventoryProducts} columns={columns}
                                                          currentPage={currentPage}
                                                          totalPages={totalPages}
                                                          onChangePage={onChangePage} />
                </Card>

            </div>
        </>
    );
};

export default StockInventoryProductPage;