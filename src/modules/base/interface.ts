export enum BaseStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export const BaseStatusVietnamese : Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'Đang hoạt động',
    [BaseStatus.INACTIVE]: 'Ngưng hoạt động',
};

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export const GenderVietnamese : Record<Gender, string> = {
    [Gender.FEMALE]: 'Nữ',
    [Gender.MALE]: 'Nam'
};