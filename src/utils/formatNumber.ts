const formatNumberToCurrency = (num: number) => {
    if (num === 0) {
        return 0;
    }
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
    return formatter + ' VND';
};

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

export {
    formatNumberToCurrency,
    formatNumber,
};