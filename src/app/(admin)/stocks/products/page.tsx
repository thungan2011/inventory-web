'use client';
import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/table-core';
import { exportToExcel } from '@/utils/exportToExcel';
import Card from '@/components/Card';
import Table from '@/components/Tables';
import { StockProductOverview, StockProductStatus } from '@/modules/stock/products/interface';
import StockProductStatusBadge from '@/components/Badge/StockProductStatusBadge';
import ButtonAction from '@/components/ButtonAction';

const StockProductPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages] = useState<number>(0);
    const [stockProducts, setStockProducts] = useState<StockProductOverview[]>([]);

    useEffect(() => {
        setStockProducts([
            {
                id: '12345',
                sku: 'HDD1234',
                name: 'Macca',
                unit: 'g',
                weight: 200,
                packing: 'Hũ nhựa',
                quantity_availabel: 115,
                status: StockProductStatus.INACTIVE,
            },
        ]);
    }, []);

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        document.title = 'Nut Garden - Khu vực lưu trữ';
    }, []);

    const columns = React.useMemo<ColumnDef<StockProductOverview>[]>(
        () => [
            {
                accessorKey: 'sku',
                header: 'SKU',
            },
            {
                accessorKey: 'name',
                header: 'Tên',
            },
            {
                accessorKey: 'weight',
                header: () => <span>Khối lượng</span>,
                cell: ({ row }) => <div>{`${row.original.weight} ${row.original.unit}`}</div>,
            },
            {
                accessorKey: 'quantity_availabel',
                header: 'Số lượng',
            },
            {
                accessorKey: 'packing',
                header: 'Đóng gói',
            },
            {
                accessorKey: 'status',
                header: () => <span>Trạng thái</span>,
                cell: ({ row }) => <StockProductStatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'actions',
                header: () => '',
                cell: ({ row }) => (
                    <div className="inline-flex gap-2 items-center">
                        <ButtonAction.View href={`/stocks/products/${row.original.sku}`} />
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
        exportToExcel<StockProductOverview>(stockProducts, [], 'stockProducts.xlsx');
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
                    <Table<StockProductOverview> data={stockProducts} columns={columns} currentPage={currentPage}
                                                 totalPages={totalPages}
                                                 onChangePage={onChangePage} />
                </Card>
            </div>
        </>
    );
};

export default StockProductPage;