import { ROLE_ADMIN, ROLE_EMPLOYEE_SALE, ROLE_WAREHOUSE_KEEPER } from '@/modules/authentication/interface';

export const formatGender = (gender: number) => {
    switch (gender) {
        case 1:
            return 'Nam';
        case 0:
            return 'Nữ';
        case 2:
            return 'Khác';
    }
};

export const formatRole = (role: string) : string => {
    switch (role) {
        case ROLE_ADMIN:
            return 'Quản trị viên';
        case ROLE_EMPLOYEE_SALE:
            return 'Nhân viên bán hàng';
        case ROLE_WAREHOUSE_KEEPER:
            return 'Thủ kho';
        default:
            return role;
    }
};