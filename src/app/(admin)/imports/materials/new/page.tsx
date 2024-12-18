'use client';
import React, { useEffect, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Card from '@/components/Card';
import { array, number, object, string } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import Select, { SelectProps } from '@/components/Select';
import TextArea from '@/components/TextArea';
import { ImportMaterialType, ImportMaterialTypeVietnamese } from '@/modules/imports/materials/interface';
import UploadImage from '@/components/UploadImage';
import { BaseStatus } from '@/modules/base/interface';
import { useAllProviders } from '@/modules/providers/repository';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import { formatNumberToCurrency } from '@/utils/formatNumber';
import InputCurrency from '@/components/InputCurrency';
import { MdRemoveCircleOutline } from 'react-icons/md';
import MaterialSearch from '@/components/MaterialSearch';
import { useAllMaterials } from '@/modules/materials/repository';
import { MaterialOverview, MaterialStatus } from '@/modules/materials/interface';
import ModalChooseLocation, { LocationAllocation } from '@/components/Pages/Import/Material/ModalChooseLocation';
import { useCreateImportMaterial } from '@/modules/imports/materials/repository';
import dayjs from 'dayjs';
import { useAllEmployees } from '@/modules/employees/repository';
import { useRouter } from 'next/navigation';
import { StorageAreaType } from '@/modules/storage-area/interface';
import { useAllExportMaterials, useExportMaterialByCode } from '@/modules/exports/materials/repository';
import { ExportMaterialStatus, ExportMaterialType } from '@/modules/exports/materials/interface';
import { formatDateToLocalDate } from '@/utils/formatDate';
import DatePicker from '@/components/DatePicker';

const materialSchema = object({
    quantity: number().required('Vui lòng nhập số lượng')
        .min(1, 'Số lượng không được nhỏ hơn 1'),
});

const ImportMaterialReceiptSchema = object({
    note: string().trim().max(500, 'Ghi chú không được vuợt quá 500 ký tự'),
    receiver: number().required('Người nhận hàng không được để trống'),
    type: string().required('Loại giao dịch là bắt buộc')
        .oneOf(Object.values(ImportMaterialType), 'Loại giao dịch không hợp lệ'),
    provider: number().when('type', {
        is: ImportMaterialType.NORMAL,
        then: (schema) => schema.required('Vui lòng chọn nhà cung cấp'),
        otherwise: (schema) => schema.optional(),
    }),
    materials: array()
        .of(materialSchema)
        .min(1, 'Vui lòng chọn ít nhất một nguyên liệu')
        .required('Vui lòng chọn ít nhất một nguyên liệu'),
});

interface Material {
    id: number;
    sku: string;
    name: string;
    price: number;
    origin: string;
    packing: string;
    quantity: number;
    maxQuantity?: number;
    unit: string;
    weight: number;
    locations: LocationAllocation[];
    expiryDate: Date;
}

interface ImportMaterialFormValues {
    materials: Material[];
    note: string;
    type: ImportMaterialType;
    provider?: number;
    receiver?: number;
    receipt?: string;
}

const initialFormValues: ImportMaterialFormValues = {
    materials: [],
    note: '',
    type: ImportMaterialType.NORMAL,
};

const MaterialTable = () => {
    const { values, setFieldValue } = useFormikContext<ImportMaterialFormValues>();
    const tomorrow = dayjs().add(1, 'day').toDate();
    const [selectedMaterial, setSelectedMaterial] = useState<{ index: number, quantity: number } | null>(null);

    return (
        <>
            <TableCore className="mt-3">
                <TableCore.Header>
                    <TableCore.RowHeader>
                        <TableCore.Head>Nguyên liệu</TableCore.Head>
                        <TableCore.Head>Giá nhập</TableCore.Head>
                        {values.type === ImportMaterialType.RETURN && <TableCore.Head>Số lượng đã xuất</TableCore.Head>}
                        <TableCore.Head>{values.type === ImportMaterialType.RETURN ? 'Số lượng nhập lại' : 'Số lượng'}</TableCore.Head>
                        <TableCore.Head>Ngày hết hạn</TableCore.Head>
                        <TableCore.Head className="text-nowrap">Thành tiền</TableCore.Head>
                        <TableCore.Head>Vị trí lưu kho</TableCore.Head>
                        <TableCore.Head className="!max-w-8"></TableCore.Head>
                    </TableCore.RowHeader>
                </TableCore.Header>
                <FieldArray name="materials" render={arrayHelper => (
                    <TableCore.Body>
                        {
                            values.materials.length > 0 ? (
                                values.materials.map((material, index) => (
                                    <TableCore.RowBody key={material.id}>
                                        <TableCore.Cell>
                                            <div className="flex gap-2">
                                                <div
                                                    className="relative w-14 h-14 border rounded overflow-hidden">
                                                    <Image src={LOGO_IMAGE_FOR_NOT_FOUND}
                                                           alt={`Ảnh của ${material.name}`}
                                                           fill
                                                           className="object-cover" />
                                                </div>
                                                <div
                                                    className="flex-1 flex flex-col justify-center max-w-72">
                                                    <div
                                                        className="text-sm font-medium line-clamp-1"
                                                        title={`${material.sku} - ${material.name}`}
                                                    >
                                                        {material.sku} - {material.name}
                                                    </div>
                                                    <div
                                                        className="text-xs line-clamp-1">{material.packing} - {material.weight}{material.unit}</div>
                                                </div>
                                            </div>
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            {
                                                values.type === ImportMaterialType.NORMAL ? (
                                                    <InputCurrency name={`materials.${index}.price`}
                                                                   placeholder="Nhập giá nhập"
                                                                   step={1000}
                                                                   className="!w-36"
                                                                   wrapperClassName="mb-0"
                                                                   unit="VND"
                                                    />
                                                ) : (
                                                    formatNumberToCurrency(material.price)
                                                )
                                            }
                                        </TableCore.Cell>
                                        {
                                            values.type === ImportMaterialType.RETURN && (
                                                <TableCore.Cell>
                                                    {material.maxQuantity}
                                                </TableCore.Cell>
                                            )
                                        }
                                        <TableCore.Cell>
                                            <InputCurrency name={`materials.${index}.quantity`}
                                                           placeholder="Nhập số lượng"
                                                           step={1}
                                                           min={0}
                                                           max={material.maxQuantity}
                                                           className="!w-20"
                                                           wrapperClassName="mb-0"
                                            />
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            {
                                                values.type === ImportMaterialType.NORMAL ? (
                                                    <div className="relative">
                                                        <DatePicker name={`materials.${index}.expiryDate`}
                                                                    minDate={tomorrow}
                                                                    wrapperClassName="mb-0"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {dayjs(material.expiryDate).format('DD/MM/YYYY')}
                                                    </div>
                                                )
                                            }
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            {formatNumberToCurrency(material.price * material.quantity)}
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            {
                                                values.materials[index].locations.length > 0 && (
                                                    <div className="w-60 space-y-1">
                                                        {
                                                            values.materials[index].locations.map((location, index) => (
                                                                <div key={index}
                                                                     className="flex gap-2 items-center border border-dashed border-brand-500 text-brand-500 rounded-lg py-1 px-2">
                                                                    <div
                                                                        className="text-xs text-nowrap">
                                                                        {location.name} ({location.quantity})
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                            <button type="button"
                                                    className="text-brand-500 hover:underline mt-2"
                                                    onClick={() => setSelectedMaterial({
                                                        index,
                                                        quantity: material.quantity,
                                                    })}
                                            >
                                                {values.materials[index].locations.length > 0 ? 'Chỉnh sửa' : 'Chọn vị trí'}
                                            </button>
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            <div className="flex justify-end items-center">
                                                <button type="button"
                                                        onClick={() => arrayHelper.remove(index)}>
                                                    <MdRemoveCircleOutline size={20} />
                                                </button>
                                            </div>
                                        </TableCore.Cell>
                                    </TableCore.RowBody>
                                ))
                            ) : (
                                <TableCore.RowBody>
                                    <TableCore.Cell colSpan={7}>
                                        <div className="text-center text-gray-400 py-10">
                                            Chưa có nguyên liệu nào
                                        </div>
                                    </TableCore.Cell>
                                </TableCore.RowBody>
                            )
                        }
                    </TableCore.Body>
                )} />
            </TableCore>

            {
                selectedMaterial && (
                    <ModalChooseLocation onClose={() => setSelectedMaterial(null)}
                                         locations={values.materials[selectedMaterial.index].locations}
                                         totalQuantity={selectedMaterial.quantity}
                                         onSubmit={(allocations) => {
                                             setFieldValue(`materials.${selectedMaterial.index}.locations`, allocations);
                                         }}
                                         locationType={StorageAreaType.MATERIAL}
                    />
                )
            }
        </>
    );
};

interface FormContentProps {
    isLoading: boolean;
}

const FormContent = ({ isLoading }: FormContentProps) => {
    const { values, errors, touched, setFieldValue } = useFormikContext<ImportMaterialFormValues>();
    const tomorrow = dayjs().add(1, 'day').toDate();
    const [showListMaterial, setShowListMaterial] = useState<boolean>(false);
    const [providerSearchTerm, setProviderSearchTerm] = useState<string>('');
    const [materialSearchTerm, setMaterialSearchTerm] = useState<string>('');
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>('');
    const [exportReceptionSearchTerm, setExportReceptionSearchTerm] = useState<string>('');

    const providerQuery = useAllProviders({
        name: providerSearchTerm,
        status: BaseStatus.ACTIVE,
    });

    const materialQuery = useAllMaterials({
        name: materialSearchTerm,
        status: MaterialStatus.ACTIVE,
    });

    const employeeQuery = useAllEmployees({
        first_name: employeeSearchTerm,
    });

    const exportMaterialQuery = useAllExportMaterials({
        code: exportReceptionSearchTerm,
        type: ExportMaterialType.NORMAL,
        status: ExportMaterialStatus.COMPLETED,
    });

    const { data: exportMaterial } = useExportMaterialByCode(values.receipt?.split('-')[0]);

    const typeOptions: SelectProps['options'] = Object.keys(ImportMaterialType)
        .filter(type => type !== ImportMaterialType.OTHER)
        .map(type => (
            {
                label: ImportMaterialTypeVietnamese[type as ImportMaterialType],
                value: type,
            }
        ));

    const providerOptions: SelectProps['options'] = (providerQuery.data?.data || []).map(provider => ({
        label: `${provider.code} - ${provider.name}`,
        value: provider.id,
    }));

    const employeeOptions: SelectProps['options'] = (employeeQuery.data?.data || []).map(employee => ({
        label: `${employee.code} - ${employee.firstName} ${employee.lastName}`,
        value: employee.id,
    }));

    const exportReceptionOptions: SelectProps['options'] = (exportMaterialQuery.data?.data || []).map(exportMaterial => ({
        label: `${exportMaterial.code} - ${formatDateToLocalDate(exportMaterial.createdAt)}`,
        value: `${exportMaterial.code}-${exportMaterial.id}`,
    }));

    const availableMaterials = React.useMemo(() => {
        if (!materialQuery.data) return [];

        return materialQuery.data.data;
    }, [materialQuery.data]);

    const handleAddMaterial = (material: MaterialOverview) => {
        const newMaterial: Material = {
            id: material.id,
            sku: material.sku,
            price: 0,
            quantity: 1,
            name: material.name,
            origin: material.origin,
            packing: material.packing,
            unit: material.unit,
            weight: material.weight,
            locations: [],
            expiryDate: tomorrow,
        };
        setFieldValue('materials', [...values.materials, newMaterial]);
        setShowListMaterial(false);
    };

    useEffect(() => {
        if (values.type === ImportMaterialType.RETURN) {
            setFieldValue('provider', undefined);

            if (exportMaterial !== null) {
                setFieldValue('materials', exportMaterial.details.map(detail => ({
                    id: detail.material.id,
                    sku: detail.material.sku,
                    price: 0,
                    maxQuantity: detail.quantity,
                    quantity: detail.quantity,
                    name: detail.material.name,
                    origin: detail.material.origin,
                    packing: detail.material.packing,
                    unit: detail.material.unit,
                    weight: detail.material.weight,
                    locations: [],
                    expiryDate: dayjs(detail.expiryDate).toDate(),
                })));
            }

        } else {
            setFieldValue('reception', undefined);
        }
    }, [values.type, exportMaterial, setFieldValue]);

    return (
        <Form>
            <div className="grid gap-x-3 mt-5">
                <Card className={`p-[18px]`}>
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                        <div className="grid grid-cols-2 gap-2">
                            <Select name="type"
                                    label="Loại giao dịch"
                                    options={typeOptions}
                            />
                            <Select name="receiver"
                                    label="Người nhận hàng"
                                    required
                                    placeholder="Chọn người nhận hàng"
                                    options={employeeOptions}
                                    searchPlaceholder="Nhập tên nhân viên..."
                                    enableSearch
                                    onSearch={setEmployeeSearchTerm}
                            />
                        </div>
                        {
                            values.type === ImportMaterialType.NORMAL && (
                                <Select name="provider"
                                        label="Nhà cung cấp"
                                        required
                                        placeholder="Chọn nhà cung cấp"
                                        searchPlaceholder="Nhập tên nhà cung cấp..."
                                        options={providerOptions}
                                        enableSearch
                                        onSearch={setProviderSearchTerm}
                                />
                            )
                        }
                        {
                            values.type === ImportMaterialType.RETURN && (
                                <Select name="receipt"
                                        label="Hóa đơn xuất"
                                        placeholder="Chọn hóa đơn xuất"
                                        searchPlaceholder="Nhập mã hóa đơn..."
                                        options={exportReceptionOptions}
                                        enableSearch
                                        onSearch={setExportReceptionSearchTerm}
                                />
                            )
                        }
                        <TextArea name="note"
                                  label="Ghi chú"
                                  placeholder="Nhập ghi chú (nếu có)"
                        />
                    </div>
                </Card>
            </div>

            <div className="mt-5">
                <Card className={`p-[18px] col-span-3`}>
                    <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>
                    <div className="flex gap-2 items-center">
                        <div className="font-normal text-sm cursor-pointer">Danh sách nguyên vật liệu:</div>
                        {errors.materials && touched.materials && typeof errors.materials === 'string' && (
                            <div className="text-red-500 text-xs">{errors.materials}</div>
                        )}
                    </div>
                    <div className="border p-2 rounded">
                        {
                            values.type !== ImportMaterialType.RETURN && (
                                <div>
                                    <MaterialSearch onSearchChange={setMaterialSearchTerm}
                                                    onSelect={handleAddMaterial}
                                                    onShowDropdownChange={setShowListMaterial}
                                                    materials={availableMaterials}
                                                    searchValue={materialSearchTerm}
                                                    showDropdown={showListMaterial}
                                    />
                                </div>
                            )
                        }
                        <MaterialTable />
                    </div>
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
                <ButtonIcon icon={<FaSave />} type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                </ButtonIcon>
            </div>
        </Form>
    );
};

const NewImportMaterialPage = () => {
    const router = useRouter();
    const createImportMaterial = useCreateImportMaterial();

    useEffect(() => {
        document.title = 'Nut Garden - Phiếu nhập';
    }, []);

    const handleSubmit = async (values: ImportMaterialFormValues) => {
        console.log(values);
        try {

            await createImportMaterial.mutateAsync({
                type: values.type,
                note: values.note,
                material_export_receipt_id: values.type === ImportMaterialType.RETURN ? Number(values.receipt?.split('-')[1]) : undefined,
                provider_id: values.type === ImportMaterialType.NORMAL ? values.provider : undefined,
                receiver_id: values.receiver,
                materials: values.materials.flatMap(material =>
                    material.locations.map(location => ({
                        material_id: material.id,
                        price: material.price,
                        quantity: location.quantity,
                        expiry_date: dayjs(material.expiryDate).format('YYYY-MM-DD'),
                        storage_area_id: location.id,
                    })),
                ),
            });
            router.push('/imports/materials');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ImportMaterialReceiptSchema}>
                <FormContent isLoading={createImportMaterial.isPending} />
            </Formik>
        </div>
    );
};
export default NewImportMaterialPage;