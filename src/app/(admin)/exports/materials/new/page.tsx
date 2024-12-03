'use client';
import React, { useEffect, useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Card from '@/components/Card';
import { object } from 'yup';
import Typography from '@/components/Typography';
import { ButtonIcon } from '@/components/Button';
import { FaSave } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Link from '@/components/Link';
import TextArea from '@/components/TextArea';
import UploadImage from '@/components/UploadImage';
import {
    ExportMaterialStatus,
    ExportMaterialStatusVietnamese,
    ExportMaterialType,
    ExportMaterialTypeVietnamese,
} from '@/modules/exports/materials/interface';
import Select, { SelectProps } from '@/components/Select';
import TableCore from '@/components/Tables/TableCore';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import InputCurrency from '@/components/InputCurrency';
import { MdRemoveCircleOutline } from 'react-icons/md';
import ModalChooseLocation, { LocationAllocation } from '@/components/Pages/Import/Material/ModalChooseLocation';
import { StorageAreaType } from '@/modules/storage-area/interface';
import MaterialSearch from '@/components/MaterialSearch';
import { useAllMaterials } from '@/modules/materials/repository';
import { MaterialOverview, MaterialStatus } from '@/modules/materials/interface';
import { useRouter } from 'next/navigation';
import { useCreateExportMaterial } from '@/modules/exports/materials/repository';

const ExportMaterialSchema = object({});

interface Material {
    id: number;
    sku: string;
    name: string;
    origin: string;
    packing: string;
    quantityAvailable: number;
    quantity: number;
    unit: string;
    weight: number;
    locations: LocationAllocation[];
    expiryDate: Date;
}

interface FormValues {
    status: ExportMaterialStatus;
    note: string;
    type: ExportMaterialType;
    materials: Material[];
}

const initialFormValues: FormValues = {
    status: ExportMaterialStatus.COMPLETED,
    note: '',
    type: ExportMaterialType.NORMAL,
    materials: [],
};

const MaterialTable = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const [selectedMaterial, setSelectedMaterial] = useState<{ index: number, quantity: number } | null>(null);

    return (
        <>
            <TableCore className="mt-3">
                <TableCore.Header>
                    <TableCore.RowHeader>
                        <TableCore.Head>Nguyên liệu</TableCore.Head>
                        <TableCore.Head>Tồn kho khả dụng</TableCore.Head>
                        <TableCore.Head>Số lượng</TableCore.Head>
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
                                            {material.quantityAvailable}
                                        </TableCore.Cell>
                                        <TableCore.Cell>
                                            <InputCurrency name={`materials.${index}.quantity`}
                                                           placeholder="Nhập số lượng"
                                                           step={1}
                                                           min={0}
                                                           max={material.quantityAvailable}
                                                           className="!w-20"
                                                           wrapperClassName="mb-0"
                                            />
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

interface FormSelectionProps {
    isLoading: boolean;
}

const FormSelection = ({ isLoading } : FormSelectionProps) => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    const [showListMaterial, setShowListMaterial] = useState<boolean>(false);
    const [materialSearchTerm, setMaterialSearchTerm] = useState<string>('');

    const materialQuery = useAllMaterials({
        name: materialSearchTerm,
        status: MaterialStatus.ACTIVE,
    });

    const typeOptions: SelectProps['options'] = Object.keys(ExportMaterialType).map(type => (
        {
            label: ExportMaterialTypeVietnamese[type as ExportMaterialType],
            value: type,
        }
    ));

    const statusOptions: SelectProps['options'] = Object.keys(ExportMaterialStatus).map(status => (
        {
            label: ExportMaterialStatusVietnamese[status as ExportMaterialStatus],
            value: status,
        }
    ));

    const availableMaterials = React.useMemo(() => {
        if (!materialQuery.data) return [];

        return materialQuery.data.data.filter(material => {
            return !values.materials.find(m => m.id === material.id);
        });
    }, [materialQuery.data, values.materials]);

    const handleAddMaterial = (material: MaterialOverview) => {
        const isExist = values.materials.find(m => m.id === material.id);
        if (!isExist) {
            const newMaterial: Material = {
                id: material.id,
                sku: material.sku,
                quantity: 1,
                quantityAvailable: material.quantityAvailable,
                name: material.name,
                origin: material.origin,
                packing: material.packing,
                unit: material.unit,
                weight: material.weight,
                locations: [],
                expiryDate: new Date(),
            };
            setFieldValue('materials', [...values.materials, newMaterial]);
        }
        setShowListMaterial(false);
    };

    return (
        <Form>
            <div className="grid gap-x-3 mt-5">
                <Card className={`p-[18px]`}>
                    <Typography.Title level={4}>Thông tin chung</Typography.Title>
                    <div className="border rounded-[6px] border-[rgb(236, 243, 250)] py-4 px-4.5 te">
                        <Select name="type"
                                label="Loại giao dịch"
                                options={typeOptions}
                        />
                        <Select name="status"
                                label="Trạng thái"
                                options={statusOptions}
                        />
                        <TextArea name="note" label="Ghi chú" placeholder="Nhập ghi chú (nếu có)" />
                    </div>
                </Card>
            </div>
            <div className="mt-5">
                <Card className={`p-[18px] col-span-3`}>
                    <Typography.Title level={4}>Thông tin chi tiết</Typography.Title>
                    <div className="border p-2 rounded">
                        <div>
                            <MaterialSearch onSearchChange={setMaterialSearchTerm}
                                            onSelect={handleAddMaterial}
                                            onShowDropdownChange={setShowListMaterial}
                                            materials={availableMaterials}
                                            searchValue={materialSearchTerm}
                                            showDropdown={showListMaterial}
                            />
                        </div>
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
                <Link href={'/exports/materials'}>
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

const NewExportMaterialPage = () => {
    const router = useRouter();
    const createExportMaterial = useCreateExportMaterial();

    useEffect(() => {
        document.title = 'Nut Garden - Phiếu xuất';
    }, []);

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        console.table(values);
        try {
            await createExportMaterial.mutateAsync({
                type: values.type,
                note: values.note,
                materials: values.materials.flatMap(material =>
                    material.locations.map(location => ({
                        material_id: material.id,
                        quantity: location.quantity,
                        storage_area_id: location.id,
                    })),
                ),
            });
            router.push('/exports/materials');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={initialFormValues} onSubmit={handleSubmit}
                    validationSchema={ExportMaterialSchema}>
                <FormSelection isLoading={false} />
            </Formik>
        </div>
    );
};
export default NewExportMaterialPage;