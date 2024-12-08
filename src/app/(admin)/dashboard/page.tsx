"use client";
import React, { useEffect } from 'react';
import Widget from '../../../components/Widget';
import MiniCalendar from '@/components/Calendar/MiniCalendar';
import WeeklyRevenue from '@/components/DashBoard/WeeklyRevenue';
import PieChartCard from '@/components/DashBoard/PieChartCard';
import { useReport } from '@/modules/reports/repository';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import { IoReceiptOutline, IoStatsChartOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { RiCustomerService2Line } from 'react-icons/ri';
import { PiGrainsLight } from 'react-icons/pi';
import { TfiPackage } from 'react-icons/tfi';

const Dashboard = () => {
    const { data: report } = useReport();

    useEffect(() => {
        document.title = 'Nut Garden - Dashboard';
    }, []);

    return (
        <div>
            <div className="mt-3 grid grid-cols-1  gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                <Widget icon={<IoStatsChartOutline className="h-7 w-7" />} title="Tổng doanh thu" subtitle={report ? formatNumberToCurrency(report.summary.todayRevenue).toString(): '0'}/>
                <Widget icon={<IoReceiptOutline className="h-7 w-7" />} title="Hóa đơn chờ duyệt" subtitle={report ? report.summary.pendingImports.toString(): '0'}/>
                <Widget icon={<TfiPackage className="h-7 w-7" />} title="Tổng số thành phẩm" subtitle={report ? report.summary.totalProduct.toString(): '0'}/>
                <Widget icon={<PiGrainsLight className="h-7 w-7" />} title="Tổng số nguyên vật liệu" subtitle={report ? report.summary.totalMaterial.toString(): '0'}/>
                <Widget icon={<RiCustomerService2Line className="h-7 w-7" />} title="Tổng số nhân viên" subtitle={report ? report.summary.totalEmployee.toString(): '0'}/>
                <Widget icon={<LuUsers className="h-7 w-7" />} title="Tổng số khách hàng" subtitle={report ? report.summary.totalCustomer.toString(): '0'}/>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <WeeklyRevenue/>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <PieChartCard/>
                    <MiniCalendar/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;