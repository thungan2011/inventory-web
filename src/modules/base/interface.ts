export enum BaseStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export const BaseStatusVietnamese: Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'Đang hoạt động',
    [BaseStatus.INACTIVE]: 'Ngưng hoạt động',
};

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export const GenderVietnamese: Record<Gender, string> = {
    [Gender.FEMALE]: 'Nữ',
    [Gender.MALE]: 'Nam',
    [Gender.OTHER]: 'Khác',
};

export const getEnumGender = (value: number): Gender => {
    switch (value) {
        case 1:
            return Gender.MALE;
        case    2:
            return Gender.FEMALE;
        default:
            return Gender.OTHER;
    }
};

export interface IAddressForm {
    address: string;
    ward: string;
    wardCode: string;
    district: string;
    districtCode: string;
    city: string;
    cityCode: string;
}