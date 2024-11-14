export const barChartDataWeeklyRevenue = [
    {
        name: "Bố già",
        data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
        color: '#6AD2Fa',
    },
    {
        name: "Lật mặt 7",
        data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
        color: '#4318FF',
    },
    {
        name: "Ma Da",
        data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
        color: '#EFF4FB',
    }
];

export const barChartOptionsWeeklyRevenue = {
    chart: {
        stacked: true,
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        style: {
            fontSize: '12px',
            backgroundColor: '#000000',
        },
        theme: 'dark',
    },
    xaxis: {
        categories: ['17', '18', '19', '20', '21', '22', '23', '24', '25'],
        show: false,
        labels: {
            show: true,
            style: {
                colors: '#A3AED0',
                fontSize: '14px',
                fontWeight: '500',
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        show: false,
        color: 'black',
        labels: {
            show: false,
            style: {
                colors: '#A3AED0',
                fontSize: '14px',
                fontWeight: '500',
            },
        },
    },
    grid: {
        borderColor: 'rgba(163, 174, 208, 0.3)',
        show: true,
        yaxis: {
            lines: {
                show: false,
                opacity: 0.5,
            },
        },
        row: {
            opacity: 0.5,
        },
        xaxis: {
            lines: {
                show: false,
            },
        },
    },
    fill: {
        type: 'solid',
        colors: ['#5E37FF', '#6AD2FF', '#E1E9F8'],
    },
    legend: {
        show: false,
    },
    colors: ['#5E37FF', '#6AD2FF', '#E1E9F8'],
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            columnWidth: '20px',
        },
    },
};

export const pieChartOptions = {
    labels: ['Your files', 'System', 'Empty'],
    colors: ['#4318FF', '#6AD2FF', '#EFF4FB'],
    chart: {
        width: '50px',
    },
    states: {
        hover: {
            filter: {
                type: 'none',
            },
        },
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
        donut: {
            expandOnClick: false,
            donut: {
                labels: {
                    show: false,
                },
            },
        },
    },
    fill: {
        colors: ['#4318FF', '#6AD2FF', '#EFF4FB'],
    },
    tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
            fontSize: '12px',
            fontFamily: undefined,
            backgroundColor: '#000000',
        },
    },
};

export const pieChartData = [63, 25, 12];