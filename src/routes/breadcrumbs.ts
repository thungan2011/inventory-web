interface IBreadcrumb {
    label: string;
    link: string;
    breadcrumbTrail: { label: string; link?: string }[];
}

export const breadcrumbs: IBreadcrumb[] = [
    {
        label: 'Trang chủ',
        link: '^/dashboard$',
        breadcrumbTrail: [
            { label: 'Trang chủ' },
        ],
    },
    {
        label: 'Quản lý đơn hàng',
        link: '^/orders$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng' },
        ],
    },
    {
        label: 'Tạo đơn hàng',
        link: '^/orders/new$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng', link: "/orders" },
            { label: 'Tạo mới' },
        ],
    },
    {
        label: 'Cập nhật đơn hàng',
        link: '^/orders/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng', link: "/orders" },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Chi tiết đơn hàng',
        link: '^/orders/[^/]+$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng', link: "/orders" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý danh mục',
        link: '^/categories$',
        breadcrumbTrail: [
            { label: 'Danh mục' },
            { label: 'Danh sách danh mục' },
        ],
    },
    {
        label: 'Quản lý thành phẩm',
        link: '^/products$',
        breadcrumbTrail: [
            { label: 'Thành phẩm' },
            { label: 'Danh sách thành phẩm' },
        ],
    },
    {
        label: 'Bảng giá',
        link: '^/products/prices$',
        breadcrumbTrail: [
            { label: 'Thành phẩm' },
            { label: 'Bảng giá' },
        ],
    },
    {
        label: 'Thêm thành phẩm',
        link: '^/products/new$',
        breadcrumbTrail: [
            { label: 'Thành phẩm' },
            { label: 'Danh sách thành phẩm', link: "/products" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Cập nhật sản phẩm',
        link: '^/products/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Thành phẩm' },
            { label: 'Danh sách thành phẩm', link: "/products" },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Chi tiết sản phẩm',
        link: '^/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Thành phẩm' },
            { label: 'Danh sách thành phẩm', link: "/products" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý Combo',
        link: '^/combos$',
        breadcrumbTrail: [
            { label: 'Sản phẩm Combo - Hộp quà tết' },
            { label: 'Danh sách Combo - Hộp quà Tết' },
        ],
    },
    {
        label: 'Thêm Combo - Hộp quà tết',
        link: '^/combos/new$',
        breadcrumbTrail: [
            { label: 'Combo - Hộp quà tết' },
            { label: 'Danh sách Combo', link: "/combos" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Chi tiết Combo - Hộp quà tết',
        link: '^/combos/[^/]+$',
        breadcrumbTrail: [
            { label: 'Combo - Hộp quà tết' },
            { label: 'Danh sách Combo', link: "/combos" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý nguyên vật liệu',
        link: '^/materials$',
        breadcrumbTrail: [
            { label: 'Nguyên vật liệu' },
            { label: 'Danh sách nguyên vật liệu' },
        ],
    },
    {
        label: 'Thêm nguyên vật liệu',
        link: '^/materials/new$',
        breadcrumbTrail: [
            { label: 'Nguyên vật liệu' },
            { label: 'Danh sách nguyên vật liệu', link: "/materials" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Cập nhật nguyên vật liệu',
        link: '^/materials/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Nguyên vật liệu' },
            { label: 'Danh sách nguyên vật liệu', link: "/materials" },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Chi tiết nguyên vật liệu',
        link: '^/materials/[^/]+$',
        breadcrumbTrail: [
            { label: 'Nguyên vật liệu' },
            { label: 'Danh sách nguyên vật liệu', link: "/materials" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý nhà cung cấp',
        link: '^/providers$',
        breadcrumbTrail: [
            { label: 'Nhà cung cấp' },
            { label: 'Danh sách nhà cung cấp' },
        ],
    },
    {
        label: 'Thêm nhà cung cấp',
        link: '^/providers/new$',
        breadcrumbTrail: [
            { label: 'Nhà cung cấp' },
            { label: 'Danh sách nhà cung cấp', link: "/providers" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Cập nhật nhà cung cấp',
        link: '^/providers/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Nhà cung cấp' },
            { label: 'Danh sách nhà cung cấp', link: "/providers" },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Chi tiết nhà cung cấp',
        link: '^/providers/[^/]+$',
        breadcrumbTrail: [
            { label: 'Nhà cung cấp' },
            { label: 'Danh sách nhà cung cấp', link: "/providers" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý khách hàng',
        link: '^/customers$',
        breadcrumbTrail: [
            { label: 'Khách hàng' },
            { label: 'Danh sách khách hàng' },
        ],
    },
    {
        label: 'Thêm khách hàng',
        link: '^/customers/new$',
        breadcrumbTrail: [
            { label: 'Khách hàng' },
            { label: 'Danh sách khách hàng', link: "/customers" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Cập nhật khách hàng',
        link: '^/customers/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Khách hàng' },
            { label: 'Danh sách khách hàng', link: "/customers" },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Chi tiết khách hàng',
        link: '^/customers/[^/]+$',
        breadcrumbTrail: [
            { label: 'Khách hàng' },
            { label: 'Danh sách khách hàng', link: "/customers" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý nhập kho nguyên vật liệu',
        link: '^/imports/materials$',
        breadcrumbTrail: [
            { label: 'Nhập kho' },
            { label: 'Danh sách nhập kho' },
            { label: 'Nguyên vật liệu' },
        ],
    },
    {
        label: 'Phiếu nhập kho nguyên vật liệu',
        link: '^/imports/materials/new$',
        breadcrumbTrail: [
            { label: 'Nhập kho' },
            { label: 'Nguyên vật liệu', link: "/imports/materials" },
            { label: 'Phiếu nhập kho' },
        ],
    },
    {
        label: 'Chi tiết nhập kho',
        link: '^/imports/materials/[^/]+$',
        breadcrumbTrail: [
            { label: 'Nhập kho' },
            { label: 'Nguyên vật liệu', link: "/imports/materials" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý nhập kho thành phẩm',
        link: '^/imports/products$',
        breadcrumbTrail: [
            { label: 'Nhập kho' },
            { label: 'Danh sách nhập kho' },
            { label: 'Thành phẩm' },
        ],
    },
    {
        label: 'Phiếu nhập kho thành phẩm',
        link: '^/imports/products/new$',
        breadcrumbTrail: [
            { label: 'Nhập kho' },
            { label: 'Thành phẩm', link: "/imports/products" },
            { label: 'Phiếu nhập kho' },
        ],
    },
    {
        label: 'Chi tiết nhập kho',
        link: '^/imports/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Nhập kho' },
            { label: 'Thành phẩm', link: "/imports/products" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý xuất kho nguyên vật liệu',
        link: '^/exports/materials$',
        breadcrumbTrail: [
            { label: 'Xuất kho' },
            { label: 'Danh sách xuất kho' },
            { label: 'Nguyên vật liệu' },
        ],
    },
    {
        label: 'Phiếu xuất kho nguyên vật liệu',
        link: '^/exports/materials/new$',
        breadcrumbTrail: [
            { label: 'Xuất kho' },
            { label: 'Nguyên vật liệu', link: "/exports/materials" },
            { label: 'Phiếu xuất kho' },
        ],
    },
    {
        label: 'Chi tiết xuất kho',
        link: '^/exports/materials/[^/]+$',
        breadcrumbTrail: [
            { label: 'Xuất kho' },
            { label: 'Nguyên vật liệu', link: "/exports/materials" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý xuất kho thành phẩm',
        link: '^/exports/products$',
        breadcrumbTrail: [
            { label: 'Xuất kho' },
            { label: 'Danh sách xuất kho' },
            { label: 'Thành phẩm' },
        ],
    },
    {
        label: 'Phiếu xuất kho thành phẩm',
        link: '^/exports/products/new$',
        breadcrumbTrail: [
            { label: 'Xuất kho' },
            { label: 'Thành phẩm', link: "/exports/products" },
            { label: 'Phiếu xuất kho' },
        ],
    },
    {
        label: 'Chi tiết xuất kho',
        link: '^/exports/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Xuất kho' },
            { label: 'Thành phẩm', link: "/exports/products" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý nhân viên',
        link: '^/employees$',
        breadcrumbTrail: [
            { label: 'Nhân viên' },
            { label: 'Danh sách nhân viên' },
        ],
    },
    {
        label: 'Thêm nhân viên',
        link: '^/employees/new$',
        breadcrumbTrail: [
            { label: 'Nhân viên' },
            { label: 'Danh sách nhân viên', link: "/employees" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Chi tiết nhân viên',
        link: '^/employees/[^/]+$',
        breadcrumbTrail: [
            { label: 'Nhân viên' },
            { label: 'Danh sách nhân viên', link: "/employees" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý khu vực lưu trữ',
        link: '^/storage-area$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu trữ' },
            { label: 'Danh sách' },
            { label: 'Khu vực lưu trữ' },
        ],
    },
    {
        label: 'Chi tiết khu vực lưu trữ',
        link: '^/storage-area/[^/]+$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu trữ' },
            { label: 'Danh sách khu vực lưu trữ', link: "/storage-area" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Thêm khu vực lưu trữ',
        link: '^/storage-area/new$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu trữ' },
            { label: 'Danh sách khu vực lưu trữ', link: "/storage-area" },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Lưu kho',
        link: '^/warehouse-area/products$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu kho' },
            { label: 'Thành phẩm' },
            { label: 'Lưu kho' },
        ],
    },
    {
        label: 'Chi tiết lưu kho',
        link: '^/warehouse-area/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu kho' },
            { label: 'Thành phẩm', link: "/warehouse-area/products" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Lưu kho',
        link: '^/warehouse-area/materials$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu kho' },
            { label: 'Nguyên vật liệu' },
            { label: 'Lưu kho' },
        ],
    },
    {
        label: 'Chi tiết lưu kho',
        link: '^/warehouse-area/materials/[^/]+$',
        breadcrumbTrail: [
            { label: 'Khu vực lưu kho' },
            { label: 'Nguyên vật liệu', link: "/warehouse-area/materials" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý tồn kho',
        link: '^/stocks/materials$',
        breadcrumbTrail: [
            { label: 'Tồn kho' },
            { label: 'Nguyên vật liệu' },
            { label: 'Danh sách tồn kho nguyên vật liệu' },
        ],
    },
    {
        label: 'Chi tiết tồn kho',
        link: '^/stocks/materials/[^/]+$',
        breadcrumbTrail: [
            { label: 'Tồn kho' },
            { label: 'Nguyên vật liệu', link: "/stock/materials" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý tồn kho',
        link: '^/stocks/products$',
        breadcrumbTrail: [
            { label: 'Tồn kho' },
            { label: 'Thành phẩm' },
            { label: 'Danh sách tồn kho thành phẩm' },
        ],
    },
    {
        label: 'Chi tiết tồn kho',
        link: '^/stock/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Tồn kho' },
            { label: 'Thành phẩm', link: "/stock/products" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý kiểm kê tồn kho',
        link: '^/stock-inventorys/materials$',
        breadcrumbTrail: [
            { label: 'Kiểm kê tồn kho' },
            { label: 'Nguyên vật liệu' },
            { label: 'Danh sách kiểm kê nguyên vật liệu' },
        ],
    },
    {
        label: 'Chi tiết kiểm kê tồn kho',
        link: '^/stock-inventorys/materials/[^/]+$',
        breadcrumbTrail: [
            { label: 'Kiểm kê tồn kho' },
            { label: 'Nguyên vật liệu', link: "/warehouse-area/materials" },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý kiểm kê tồn kho',
        link: '^/stock-inventorys/products$',
        breadcrumbTrail: [
            { label: 'Kiểm kê tồn kho' },
            { label: 'Thành phẩm' },
            { label: 'Danh sách kiểm kê thành phẩm' },
        ],
    },
    {
        label: 'Chi tiết kiểm kê tồn kho',
        link: '^/stock-inventorys/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Kiểm kê tồn kho' },
            { label: 'Thành phẩm', link: "/warehouse-area/products" },
            { label: 'Chi tiết' },
        ],
    },
];