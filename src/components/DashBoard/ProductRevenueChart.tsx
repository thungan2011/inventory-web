import React, { useState } from 'react';
import Card from '@/components/Card';
import { ApexOptions } from 'apexcharts';
import { formatNumber, formatNumberToCurrency } from '@/utils/formatNumber';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { Form, Formik } from 'formik';
import Select, { SelectProps } from '@/components/Select';
import AutoSubmitForm from '@/components/AutoSubmitForm';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

interface Filter {
    startDate: string;
    endDate: string;
}

enum DateFilter {
    DAY = 'DAY',
    WEEK = 'WEEK'
}

interface FormValues {
    dateFilter: DateFilter;
}

const CinemaRevenueChart = () => {
    const today = dayjs();
    const [, setFilter] = useState<Filter>({
        startDate: today.startOf('week').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
    });

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            formatter(val: number): string | number {
                return formatNumberToCurrency(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 400,
                colors: ['#fff'],
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 3,
                borderRadiusApplication: 'end',
                barHeight: '50%',
            },
        },
        colors: ['#5E37FF'],
        xaxis: {
            categories: ['Macca', 'Hạnh nhân', 'Xoài', 'Rượu', 'Mít'],
            labels: {
                formatter(value: string): string {
                    return formatNumber(Number(value));
                },
            },
        },
        yaxis: {
            labels: {
                maxWidth: 100,
            },
        },
        grid: {
            show: false,
        },
    };

    const series = [{
        name: 'Doanh thu',
        data: [10000, 20000, 30000, 50000, 100000],
    }];

    const dateFilterOptions: SelectProps['options'] = [
        { value: DateFilter.DAY , label: 'Theo ngày' },
        { value: DateFilter.WEEK, label: 'Theo tuần' },
    ];

    const handleFilterChange = (values: FormValues) => {
        if (values.dateFilter === DateFilter.DAY) {
            setFilter({
                startDate: today.format('YYYY-MM-DD'),
                endDate: today.format('YYYY-MM-DD'),
            });
        } else {
            setFilter({
                startDate: today.startOf('week').format('YYYY-MM-DD'),
                endDate: today.format('YYYY-MM-DD'),
            });
        }
    };

    return (
        <Card extra="w-full py-6 px-2 text-center">
            <div className="mb-auto flex items-center justify-between px-6 sm-max:flex-col sm-max:items-start sm-max:px-0">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                    Top 10 doanh thu theo thành phẩm
                </h2>
                <div className="w-60">
                    <Formik initialValues={{ dateFilter: DateFilter.WEEK }} onSubmit={handleFilterChange}>
                        <Form>
                            <Select name="dateFilter" options={dateFilterOptions} />
                            <AutoSubmitForm/>
                        </Form>
                    </Formik>
                </div>
            </div>
            <div className="mt-4">
                <ReactApexChart options={options} series={series} type="bar" height={400} />
            </div>
        </Card>
    );
};

export default CinemaRevenueChart;