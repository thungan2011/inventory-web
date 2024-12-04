import React, { useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Modal';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import InputCurrency from '@/components/InputCurrency';
import { IoIosClose } from 'react-icons/io';
import Search from '@/components/Search';
import { sumBy } from 'lodash';
import { useAllWarehouseAreaMaterials } from '@/modules/warehouse-area/materials/repository';
import { WarehouseAreaMaterialOverview } from '@/modules/warehouse-area/materials/interface';
import { formatDateToLocalDate, timeFromNow } from '@/utils/formatDate';
import dayjs from 'dayjs';

export interface ExportLocation {
    id: number;
    storageAreaId: number;
    code: string;
    name: string;
    quantity: number;
    quantityAvailable: number;
    expiryDate: Date;
}

type ModalChooseExportLocationProps = {
    onClose: () => void;
    totalExportQuantity: number;
    onSubmit: (locations: ExportLocation[]) => void;
    selectedLocations: ExportLocation[];
    materialCode: string;
}

interface FormValues {
    exportLocations: ExportLocation[];
}

const validationSchema = (totalQuantity: number) => Yup.object().shape({
    exportLocations: Yup.array()
        .min(1, 'Vui lòng chọn ít nhất một khu vực lưu trữ')
        .of(
            Yup.object().shape({
                quantity: Yup.number().min(1, 'Số lượng phải lớn hơn 0')
                    .required('Vui lòng nhập số lượng'),
            }),
        ).test('totalQuantity', 'Tổng số lượng phân bổ phải bằng tổng số lượng cần phân bổ', function(allocations) {
            const total = sumBy(allocations, 'quantity');
            return total <= totalQuantity;
        }),
});

interface FormikContentProps {
    onClose: () => void;
    totalQuantity: number;
    materialCode: string;
}

interface RenderSearchItemProps {
    item: WarehouseAreaMaterialOverview;
    onSelect: (item: WarehouseAreaMaterialOverview) => void;
}

const RenderSearchItem = ({ item, onSelect }: RenderSearchItemProps) => {
    const isExpired = dayjs(item.expiryDate).isBefore(dayjs());
    const isNearExpiry = dayjs(item.expiryDate).isBefore(dayjs().add(1, 'month'));

    return (
        <div className={`px-3 py-2 cursor-pointer hover:bg-gray-100`}
             onClick={() => onSelect(item)}>
            <div className="flex gap-5 items-center">
                <div>
                    <div>#{item.storageArea.code} - {item.storageArea.name}</div>
                    <div className="text-gray-800 flex gap-3 items-center">
                                                <span>
                                                    HSD: {formatDateToLocalDate(item.expiryDate)}
                                                </span>
                        {
                            isExpired ? (
                                <span
                                    className="text-red-500 text-xs bg-red-50 border w-fit border-red-500 rounded px-1 py-0.5">Đã hết hạn</span>
                            ) : (
                                <span
                                    className={`text-xs border px-1 py-0.5 rounded ${isNearExpiry ? 'text-yellow-500 border-yellow-500 bg-yellow-50' : 'text-gray-800 bg-gray-50 border-gray-800'}`}>
                                                            {timeFromNow(item.expiryDate)}
                                                        </span>
                            )
                        }
                    </div>
                </div>
                <div>
                    <div className="border rounded px-1 py-0.5 font-medium">
                        Tồn kho: {item.quantityAvailable}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormikContent = ({ onClose, totalQuantity, materialCode }: FormikContentProps) => {
    const { values, setFieldValue, errors, submitForm } = useFormikContext<FormValues>();
    const [showListStorageArea, setShowListStorageArea] = useState<boolean>(false);
    const [storageAreaSearchTerm, setStorageAreaSearchTerm] = useState<string>('');

    const storageAreaQuery = useAllWarehouseAreaMaterials({
        material_search: materialCode,
    });

    const availableStorageArea = React.useMemo(() => {
        if (!storageAreaQuery.data) return [];

        return storageAreaQuery.data.data.filter(area => {
            return !values.exportLocations.find(a => a.id === area.id);
        });
    }, [storageAreaQuery.data, values.exportLocations]);

    const handleAddStorageArea = (item: WarehouseAreaMaterialOverview) => {
        const isExist = values.exportLocations.find(a => a.id === item.id);
        if (!isExist) {
            const newLocation: ExportLocation = {
                id: item.id,
                storageAreaId: item.storageArea.id,
                code: item.storageArea.code,
                name: item.storageArea.name,
                quantityAvailable: item.quantityAvailable,
                expiryDate: item.expiryDate,
                quantity: values.exportLocations.length === 0 ? totalQuantity : 0,
            };
            setFieldValue('exportLocations', [...values.exportLocations, newLocation]);
        }
        setShowListStorageArea(false);
    };

    return (
        <Form>
            <div className="flex gap-5 mt-3">
                <div>Tổng số lượng cần phân bổ: {totalQuantity}</div>
                <div>|</div>
                <div>Còn lại: {totalQuantity - sumBy(values.exportLocations, 'quantity')}</div>
            </div>

            <div className="border rounded p-2 my-3">
                <div>
                    <Search onSelect={handleAddStorageArea}
                            placeholder="Tìm kiếm khu vực lưu trữ"
                            items={availableStorageArea}
                            searchValue={storageAreaSearchTerm}
                            onSearchChange={setStorageAreaSearchTerm}
                            showDropdown={showListStorageArea}
                            onShowDropdownChange={setShowListStorageArea}
                            renderItem={(item, onSelect) => (
                                <RenderSearchItem item={item} onSelect={onSelect} />
                            )}
                    />
                </div>
                <div className="mt-5 ">
                    <FieldArray name="exportLocations"
                                render={arrayHelpers => (
                                    <div className="mt-1 border rounded p-2">
                                        {
                                            errors.exportLocations && typeof errors.exportLocations === 'string' && (
                                                <div className="text-red-500 text-sm">{errors.exportLocations}</div>
                                            )
                                        }
                                        {
                                            values.exportLocations.length > 0 ? (
                                                <div className="space-y-3">
                                                    {
                                                        values.exportLocations.map((location, index) => (
                                                            <div key={`warehouse-${index}`}
                                                                 className="flex flex-col justify-center border rounded h-14">
                                                                <div className="flex justify-between items-center px-3">
                                                                    <div className="flex gap-3 items-center flex-1">
                                                                        <div className="text-sm space-y-1">
                                                                            <div
                                                                                className="w-52 max-w-52 line-clamp-1">#{location.code} - {location.name}</div>
                                                                            <div>
                                                                                <div
                                                                                    className="flex gap-2 items-center">
                                                                                    <div className="text-gray-800">
                                                                                        HSD: {formatDateToLocalDate(location.expiryDate)}
                                                                                    </div>
                                                                                    <div className="text-xs">
                                                                                        {
                                                                                            dayjs(location.expiryDate).isBefore(dayjs()) ? (
                                                                                                <div
                                                                                                    className="text-red-500 text-xs bg-red-50 border w-fit border-red-500 rounded px-1 py-0.5">Đã
                                                                                                    hết hạn</div>
                                                                                            ) : (
                                                                                                <div
                                                                                                    className={`text-xs border px-1 py-0.5 rounded ${dayjs(location.expiryDate).isBefore(dayjs().add(1, 'month')) ? 'text-yellow-500 border-yellow-500 bg-yellow-50' : 'text-gray-800 bg-gray-50 border-gray-800'}`}>
                                                                                                    {timeFromNow(location.expiryDate)}
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            Tồn kho: {location.quantityAvailable}
                                                                        </div>
                                                                    </div>
                                                                    <div className="mr-16">
                                                                        <InputCurrency
                                                                            name={`exportLocations.${index}.quantity`}
                                                                            step={1}
                                                                            min={1}
                                                                            placeholder="Nhập số lượng"
                                                                            className="!h-8 !w-20"
                                                                            wrapperClassName="mb-0" />
                                                                    </div>
                                                                    <button
                                                                        className="text-red-500 hover:bg-red-100 rounded-full"
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                    >
                                                                        <IoIosClose />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <div className="text-center text-gray-800 text-sm my-5">
                                                    Chưa chọn khu vực lưu trữ
                                                </div>
                                            )
                                        }

                                    </div>
                                )}
                    />
                </div>
            </div>

            <div className="flex justify-end items-center gap-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit type="button"
                                     onClick={(e) => {
                                         e.preventDefault();
                                         submitForm();
                                     }}
                />
            </div>
        </Form>
    );
};

const ModalChooseExportLocation = ({
                                       onClose,
                                       totalExportQuantity,
                                       onSubmit,
                                       selectedLocations,
                                       materialCode,
                                   }: ModalChooseExportLocationProps) => {

    const initialValues: FormValues = {
        exportLocations: selectedLocations,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            onSubmit(values.exportLocations);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal title="Phân bổ số lượng xuất kho" open={true} onClose={onClose}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}
                        validationSchema={validationSchema(totalExportQuantity)}>
                    <FormikContent onClose={onClose} totalQuantity={totalExportQuantity} materialCode={materialCode} />
                </Formik>
            </Modal>
        </>
    );
};

export default ModalChooseExportLocation;