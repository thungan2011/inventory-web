import React from 'react';
import { useAddress } from '@/hook/useAddress';
import Select from '@/components/Select';

const AddressForm = () => {
    const { provinceOptions, districtOptions, wardOptions } = useAddress();

    return (
        <div className="grid grid-cols-3 gap-x-3">
            <Select name="cityCode"
                    label="Tỉnh/thành phố"
                    options={provinceOptions}
            />
            <Select name="districtCode"
                    label="Quận/huyện"
                    options={districtOptions}
            />
            <Select name="wardCode"
                    label="Xã/phường"
                    options={wardOptions}
            />
        </div>
    );
};

export default AddressForm;