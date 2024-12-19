import { LuLayoutGrid } from 'react-icons/lu';
import React from 'react';
import { RiMapPinUserLine, RiRoadMapLine } from 'react-icons/ri';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import { TbPackageExport, TbPackageImport, TbShoppingBagEdit, TbShoppingBagSearch } from 'react-icons/tb';
import { MdOutlineCategory, MdOutlineInventory } from 'react-icons/md';
import { FaCartFlatbedSuitcase } from 'react-icons/fa6';
import { PiWarehouse } from 'react-icons/pi';
import { AiOutlineContainer } from 'react-icons/ai';
import { Subjects } from '@/config/ability';

export type IAdminRoute = {
    name: string;
    path: string;
    icon?: React.ReactNode;
    children?: IAdminRoute[];
    subject?: Subjects;
}

const adminRoutes: IAdminRoute[] = [
    {
        name: 'Tổng quan',
        path: '/dashboard',
        icon: <LuLayoutGrid />,
        subject: 'Dashboard',
    },
    {
        name: 'Đơn hàng',
        path: '/orders',
        icon: <TbShoppingBagEdit />,
        subject: 'Order',
    },
    {
        name: 'Danh mục',
        path: '/categories',
        icon: <MdOutlineCategory />,
        subject: 'Category'
    },
    {
        name: 'Thành phẩm',
        path: '/products',
        icon: <TbShoppingBagSearch />,
        children: [
            { name: 'Tất cả thành phẩm', path: '/products' },
            { name: 'Bảng giá', path: '/products/prices' },
        ],
        subject: 'Product'
    },
    {
        name: 'Nguyên vật liệu',
        path: '/materials',
        icon: <AiOutlineContainer />,
        subject: 'Material'
    },
    {
        name: 'Nhà cung cấp',
        path: '/providers',
        icon: <FaCartFlatbedSuitcase />,
        subject: 'Provider',
    },
    {
        name: 'Khách hàng',
        path: '/customers',
        icon: <FiUsers />,
        subject: 'Customer'
    },
    {
        name: 'Khu vực lưu trữ',
        path: '/storage-area',
        icon: <RiRoadMapLine />,
        subject: 'StorageArea'
    },
    {
        name: 'Tồn kho',
        path: '/stocks',
        icon: <FiCalendar />,
        children: [
            { name: 'Nguyên vật liệu', path: '/stocks/materials' },
            { name: 'Thành phẩm', path: '/stocks/products' },
        ],
        subject: 'Stock'
    },
    {
        name: 'Nhập kho',
        path: '/imports',
        icon: <TbPackageImport />,
        children: [
            { name: 'Nguyên vật liệu', path: '/imports/materials' },
            { name: 'Thành phẩm', path: '/imports/products' },
        ],
        subject: 'Import'
    },
    {
        name: 'Xuất kho',
        path: '/exports',
        icon: <TbPackageExport />,
        children: [
            { name: 'Nguyên vật liệu', path: '/exports/materials' },
            { name: 'Thành phẩm', path: '/exports/products' },
        ],
        subject: 'Export'
    },
    {
        name: 'Kiểm kê kho',
        path: '/inventory-checks',
        icon: <MdOutlineInventory />,
        subject: 'InventoryCheck'
    },
    {
        name: 'Lịch sử kho',
        path: '/histories',
        icon: <PiWarehouse />,
        children: [
            { name: 'Nguyên vật liệu', path: '/histories/materials' },
            { name: 'Thành phẩm', path: '/histories/products' },
        ],
        subject: 'History'
    },
    {
        name: 'Nhân viên',
        path: '/employees',
        icon: <RiMapPinUserLine />,
        subject: 'Employee',
    },


];

export default adminRoutes;