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