'use client';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import Card from '@/components/Card';
import { object } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import Select from '@/components/Select';
import TextArea from '@/components/TextArea';
import {
    ImportMaterialStatus,
    ImportMaterialStatusVietnamese,
    ImportMaterialType,
    ImportMaterialTypeVietnamese,
} from '@/modules/imports/materials/interface';
import UploadImage from '@/components/UploadImage';
import useFilterPagination, { PaginationState } from '@/hook/useFilterPagination';
import { BaseStatus } from '@/modules/base/interface';
import { useAllProviders } from '@/modules/providers/repository';

const ProductSchema = object({});

interface FormValues {
    code?: string;
    status: ImportMaterialStatus;
    note: string;
    type: ImportMaterialType;
}

const initialFormValues: FormValues = {
    code: '',
    status: ImportMaterialStatus.COMPLETED,
    note: '',
    type: ImportMaterialType.NORMAL,
};

interface ProviderFilter extends PaginationState {
    name: string;
    code: string;
    status: BaseStatus | 'ALL';
    phone: string;
}

const NewProductPage = () => {

    const [filters, setFilters] = useState<ProviderFilter>({
        page: 1,
        name: '',
        code: '',
        status: 'ALL',
        phone: '',
    });

    const providerQuery = useAllProviders({
        page: filters.page,
        name: filters.name,
        code: filters.code,
        phone: filters.phone,
        status: filters.status === 'ALL' ? undefined : filters.status,
    });

    const {
        data: providers,
    } = useFilterPagination({
        queryResult: providerQuery,
        initialFilters: filters,
        onFilterChange: setFilters,
    });

    useEffect(() => {
        document.title = 'Nut Garden - Phiếu nhập';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ProductSchema}>
                <Form>
                    <div className="grid gap-x-3 mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Thông tin chung</Typography.Title>
                            <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                                <Select name="provider" label="Nhà cung cấp"
                                        options={(providers || []).map(provider => ({ label: `${provider.code} - ${provider.name}`, value: provider.id }))}
                                />
                                <Select name="type" label="Loại giao dịch"
                                        options={[
                                            ...Object.keys(ImportMaterialType).map(type => (
                                                {
                                                    label: ImportMaterialTypeVietnamese[type as ImportMaterialType],
                                                    value: type,
                                                }
                                            )),
                                        ]} />
                                <Select name="status" label="Trạng thái"
                                        options={[
                                            ...Object.keys(ImportMaterialStatus).map(status => (
                                                {
                                                    label: ImportMaterialStatusVietnamese[status as ImportMaterialStatus],
                                                    value: status,
                                                }
                                            )),
                                        ]} />
                                <TextArea name="note" label="Ghi chú" />
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px] col-span-3`}>
                            <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>

                        </Card>
                    </div>

                    <div className="mt-5">
                        <Card className={`p-[18px]`}>
                            <Typography.Title level={4}>Hình ảnh</Typography.Title>
                            <div>
                                <div>
                                    <UploadImage name="image" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-5 mb-10 flex justify-end items-center gap-4">
                        <Link href={'/imports/materials'}>
                            <ButtonIcon icon={<TiArrowBackOutline />} variant="secondary">
                                Hủy bỏ
                            </ButtonIcon>
                        </Link>
                        <ButtonIcon icon={<FaSave />} type="submit">
                            Lưu
                        </ButtonIcon>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default NewProductPage;