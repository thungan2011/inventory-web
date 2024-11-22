import React, { useEffect } from 'react';
import { useAddress } from '@/hook/useAddress';
import Select from '@/components/Select';

interface AddressFormProps {
    city: string;
    district: string;
    ward: string;
    setFieldValue: (field: string, value: string) => void;
}

const AddressForm = ({city, district, ward, setFieldValue} : AddressFormProps) => {
    const {
        provinceOptions,
        districtOptions,
        wardOptions,
        selectedProvinceName,
        selectedDistrictName,
        selectedWardName,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        setInitialAddress,
    } = useAddress();

    useEffect(() => {
        setInitialAddress(city, district, ward);
    }, [city, district, ward , setInitialAddress]);

    useEffect(() => {
        setFieldValue('city', selectedProvinceName);
        setFieldValue('district', selectedDistrictName);
        setFieldValue('ward', selectedWardName);
    }, [selectedProvinceName, selectedDistrictName, selectedWardName, setFieldValue]);

    return (
        <div className="grid grid-cols-3 gap-x-3">
            <Select name="city" label="Tỉnh/thành phố"
                    options={provinceOptions}
                    onChange={handleProvinceChange}
            />
            <Select name="district" label="Quận/huyện"
                    options={districtOptions}
                    onChange={handleDistrictChange}
            />
            <Select name="ward" label="Xã/phường"
                    options={wardOptions}
                    onChange={handleWardChange}
            />
        </div>
    );
};

export default AddressForm;