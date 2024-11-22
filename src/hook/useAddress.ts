import React, { useEffect } from 'react';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';
interface AddressOption {
    label: string;
    value: string | number;
    id?: string;
}


interface UseAddressReturn {
    provinceOptions: AddressOption[];
    districtOptions: AddressOption[];
    wardOptions: AddressOption[];
    selectedProvinceName: string;
    selectedDistrictName: string;
    selectedWardName: string;
    handleProvinceChange: (option: AddressOption) => void;
    handleDistrictChange: (option: AddressOption) => void;
    handleWardChange: (option: AddressOption) => void;
    setInitialAddress: (province: string, district: string, ward: string) => void;
}

export const useAddress = () : UseAddressReturn => {
    // Selected IDs for querying nested data
    const [selectedProvinceId, setSelectedProvinceId] = React.useState<string>('');
    const [selectedDistrictId, setSelectedDistrictId] = React.useState<string>('');

    // Selected names for form values
    const [selectedProvinceName, setSelectedProvinceName] = React.useState<string>('');
    const [selectedDistrictName, setSelectedDistrictName] = React.useState<string>('');
    const [selectedWardName, setSelectedWardName] = React.useState<string>('');

    // Initial values for setting up edit mode
    const [initialProvince, setInitialProvince] = React.useState<string>('');
    const [initialDistrict, setInitialDistrict] = React.useState<string>('');
    const [initialWard, setInitialWard] = React.useState<string>('');

    const { data: provinces } = useAllProvinces();
    const { data: districts } = useAllDistricts(selectedProvinceId);
    const { data: wards } = useAllWards(selectedDistrictId);

    const provinceOptions = provinces?.map(province => ({
        label: province.province_name,
        value: province.province_name,
        id: province.province_id,
    })) || [];

    const districtOptions = districts?.map(district => ({
        label: district.district_name,
        value: district.district_name,
        id: district.district_id
    })) || [];

    const wardOptions = wards?.map(ward => ({
        label: ward.ward_name,
        value: ward.ward_name,
        id: ward.ward_id
    })) || [];

    useEffect(() => {
        if (!provinces || !initialProvince) return;

        const matchedProvince = provinces.find(p => p.province_name === initialProvince);
        if (matchedProvince) {
            setSelectedProvinceId(matchedProvince.province_id);
            setSelectedProvinceName(initialProvince);
        }
    }, [provinces, initialProvince]);

    useEffect(() => {
        if (!districts || !initialDistrict) return;

        const matchedDistrict = districts.find(d => d.district_name === initialDistrict);
        if (matchedDistrict) {
            setSelectedDistrictId(matchedDistrict.district_id);
            setSelectedDistrictName(initialDistrict);
        }
    }, [districts, initialDistrict]);

    useEffect(() => {
        if (!wards || !initialWard) return;

        const matchedWard = wards.find(w => w.ward_name === initialWard);
        if (matchedWard) {
            setSelectedWardName(initialWard);
        }
    }, [wards, initialWard]);

    const handleProvinceChange = (option: AddressOption) => {
        console.log("option", option);

        setSelectedProvinceId(option.id || '');
        setSelectedProvinceName(option.value.toString());
        // Reset district and ward when province changes
        setSelectedDistrictId('');
        setSelectedDistrictName('');
        setSelectedWardName('');
    };

    const handleDistrictChange = (option: AddressOption) => {
        setSelectedDistrictId(option.id || '');
        setSelectedDistrictName(option.value.toString());
        // Reset ward when district changes
        setSelectedWardName('');
    };

    const handleWardChange = (option: AddressOption) => {
        setSelectedWardName(option.value.toString());
    };

    const setInitialAddress = (province: string, district: string, ward: string) => {
        setInitialProvince(province);
        setInitialDistrict(district);
        setInitialWard(ward);
    };

    return {
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
    };
};