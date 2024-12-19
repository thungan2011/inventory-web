'use client';
import React, { useEffect, useMemo } from 'react';
import Widget from '../../../components/Widget';
import { useReport } from '@/modules/reports/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { IoReceiptOutline, IoStatsChartOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { RiCustomerService2Line } from 'react-icons/ri';
import { PiGrainsLight } from 'react-icons/pi';
import { TfiPackage } from 'react-icons/tfi';
import ProductRevenueChart from '@/components/DashBoard/ProductRevenueChart';
import WeeklyRevenueChart from '@/components/DashBoard/WeeklyRevenueChart';

const Dashboard = () => {
    const { data: report } = useReport();

    useEffect(() => {
        document.title = 'Nut Garden - Dashboard';
    }, []);

    const dailyRevenueData = useMemo(() => ({
        categories: report?.revenue?.map(r => r.date.slice(0, -5)) || [],
        data: report?.revenue?.map(r => r.totalRevenue) || [],
    }), [report?.revenue]);

    const productRevenueData = useMemo(() => {
        if (!report?.productStats) {
            return {
                categories: [],
                data: []
            };
        }

        const top10Products = [...report.productStats]
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 10);

        return {
            categories: top10Products.map(product => product.name),
            data: top10Products.map(product => product.totalRevenue)
        };
    }, [report?.productStats]);


    return (
        <div>
            <div className="mt-3 grid grid-cols-1  gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                <Widget icon={<IoStatsChartOutline className="h-7 w-7" />}
                        title="Tổng doanh thu"
                        subtitle={report ? formatNumberToCurrency(report.summary.todayRevenue).toString() : '0'}
                />
                <Widget icon={<IoReceiptOutline className="h-7 w-7" />}
                        title="Hóa đơn chờ duyệt"
                        subtitle={report ? report.summary.pendingImports.toString() : '0'}
                />
                <Widget icon={<TfiPackage className="h-7 w-7" />}
                        title="Tổng số thành phẩm"
                        subtitle={report ? report.summary.totalProduct.toString() : '0'}
                />
                <Widget icon={<PiGrainsLight className="h-7 w-7" />} title="Tổng số nguyên vật liệu"
                        subtitle={report ? report.summary.totalMaterial.toString() : '0'} />
                <Widget icon={<RiCustomerService2Line className="h-7 w-7" />} title="Tổng số nhân viên"
                        subtitle={report ? report.summary.totalEmployee.toString() : '0'} />
                <Widget icon={<LuUsers className="h-7 w-7" />} title="Tổng số khách hàng"
                        subtitle={report ? report.summary.totalCustomer.toString() : '0'} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div>
                    <WeeklyRevenueChart categories={dailyRevenueData.categories}
                                        data={dailyRevenueData.data}
                    />
                </div>
                <div>
                    <ProductRevenueChart categories={productRevenueData.categories}
                                         data={productRevenueData.data}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;