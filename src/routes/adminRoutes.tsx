import { LuLayoutGrid } from 'react-icons/lu';
import React from 'react';
import { RiMapPinUserLine, RiRoadMapLine } from 'react-icons/ri';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import { TbPackageExport, TbPackageImport, TbShoppingBagEdit, TbShoppingBagSearch } from 'react-icons/tb';
import { MdOutlineCategory, MdOutlineInventory } from 'react-icons/md';
import { FaCartFlatbedSuitcase } from 'react-icons/fa6';
import { PiWarehouse } from 'react-icons/pi';
import { AiOutlineContainer } from 'react-icons/ai';

export type IAdminRoute = {
    name: string;
    path: string;
    icon?: React.ReactNode;
    children?: IAdminRoute[];
}

const adminRoutes: IAdminRoute[] = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: <LuLayoutGrid />,
    },
    {
        name: 'Đơn hàng',
        path: '/orders',
        icon: <TbShoppingBagEdit />,
    },
    {
        name: 'Danh mục',
        path: '/categories',
        icon: <MdOutlineCategory />,
    },
    {
        name: 'Thành phẩm',
        path: '/products',
        icon: <TbShoppingBagSearch />,
        children: [
            { name: 'Tất cả thành phẩm', path: '/products' },
            { name: 'Bảng giá', path: '/products/prices' },
        ]
    },
    // {
    //     name: 'Combos',
    //     path: '/combos',
    //     icon: <FiShoppingBag />,
    // },
    {
        name: 'Nguyên vật liệu',
        path: '/materials',
        icon: <AiOutlineContainer />,
    },
    {
        name: 'Nhà cung cấp',
        path: '/providers',
        icon: <FaCartFlatbedSuitcase />,
    },
    {
        name: 'Khách hàng',
        path: '/customers',
        icon: <FiUsers />,
    },
    {
        name: 'Khu vực lưu trữ',
        path: '/storage-area',
        icon: <RiRoadMapLine />,
    },
    {
        name: 'Lưu kho',
        path: '/warehouse-area',
        icon: <FiCalendar />,
        children: [
            { name: 'Nguyên vật liệu', path: '/warehouse-area/materials' },
            { name: 'Thành phẩm', path: '/warehouse-area/products' },
        ],
    },
    {
        name: 'Nhập kho',
        path: '/imports',
        icon: <TbPackageImport />,
        children: [
            { name: 'Nguyên vật liệu', path: '/imports/materials' },
            { name: 'Thành phẩm', path: '/imports/products' },
        ],
    },
    {
        name: 'Xuất kho',
        path: '/exports',
        icon: <TbPackageExport />,
        children: [
            { name: 'Nguyên vật liệu', path: '/exports/materials' },
            { name: 'Thành phẩm', path: '/exports/products' },
        ],
    },
    {
        name: 'Kiểm kê kho',
        path: '/stock-inventorys',
        icon: <MdOutlineInventory />,
        children: [
            { name: 'Nguyên vật liệu', path: '/stock-inventorys/materials' },
            { name: 'Thành phẩm', path: '/stock-inventorys/products' },
        ],
    },
    {
        name: 'Tồn kho',
        path: '/stocks',
        icon: <PiWarehouse />,
        children: [
            { name: 'Nguyên vật liệu', path: '/stocks/materials' },
            { name: 'Thành phẩm', path: '/stocks/products' },
        ],
    },
    {
        name: 'Nhân viên',
        path: '/employees',
        icon: <RiMapPinUserLine />,
    },


];

export default adminRoutes;