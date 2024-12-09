import React from 'react';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';
import { SelectProps } from '@/components/Select';
import { useFormikContext } from 'formik';

interface UseAddressReturn {
    provinceOptions: SelectProps['options'];
    districtOptions: SelectProps['options'];
    wardOptions: SelectProps['options'];
}

interface FormValues {
    city: string;
    cityCode: string;
    district: string;
    districtCode: string;
    ward: string;
    wardCode: string;
}

export const useAddress = (): UseAddressReturn => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const initialValueRef = React.useRef({
        cityCode: values.cityCode,
        districtCode: values.districtCode,
        wardCode: values.wardCode,
    });
    const isUserAction = React.useRef(false);

    const { data: cities } = useAllProvinces();
    const { data: districts } = useAllDistricts(values.cityCode);
    const { data: wards } = useAllWards(values.districtCode);

    React.useEffect(() => {
        if (districts && values.districtCode && !values.district) {
            const districtName = districts.find(district => district.district_id === values.districtCode)?.district_name;
            if (districtName) {
                setFieldValue('district', districtName);
            }
        }
    }, [districts]);

    React.useEffect(() => {
        if (wards && values.wardCode && !values.ward) {
            const wardName = wards.find(ward => ward.ward_id === values.wardCode)?.ward_name;
            if (wardName) {
                setFieldValue('ward', wardName);
            }
        }
    }, [wards]);

    React.useEffect(() => {
        if (cities && values.cityCode && !values.city) {
            const cityName = cities.find(city => city.province_id === values.cityCode)?.province_name;
            if (cityName) {
                setFieldValue('city', cityName);
            }
        }
    }, [cities]);

    React.useEffect(() => {
        if (values.cityCode !== initialValueRef.current.cityCode) {
            isUserAction.current = true;
            setFieldValue('city', cities?.find(city => city.province_id === values.cityCode)?.province_name || '');
            setFieldValue('district', '');
            setFieldValue('districtCode', '');
            setFieldValue('ward', '');
            setFieldValue('wardCode', '');
        }
    }, [values.cityCode]);

    React.useEffect(() => {
        if (isUserAction.current && values.districtCode !== initialValueRef.current.districtCode) {
            setFieldValue('district', districts?.find(district => district.district_id === values.districtCode)?.district_name || '');
            setFieldValue('ward', '');
            setFieldValue('wardCode', '');
        }
    }, [values.districtCode]);

    React.useEffect(() => {
        if (isUserAction.current && values.wardCode !== initialValueRef.current.wardCode) {
            setFieldValue('ward', wards?.find(ward => ward.ward_id === values.wardCode)?.ward_name || '');
        }
    }, [values.wardCode]);

    React.useEffect(() => {
        console.log(values);
    }, [values]);

    const provinceOptions: SelectProps['options'] = (cities || []).map(province => ({
        label: province.province_name,
        value: province.province_id,
    }));

    const districtOptions: SelectProps['options'] = (districts || []).map(district => ({
        label: district.district_name,
        value: district.district_id,
    }));

    const wardOptions: SelectProps['options'] = (wards || []).map(ward => ({
        label: ward.ward_name,
        value: ward.ward_id,
    }));

    return {
        provinceOptions,
        districtOptions,
        wardOptions,
    };
};