import React, { useState } from 'react';
import { FieldArray, Form, Formik, useFormikContext } from 'formik';
import Modal from '@/components/Modal';
import ButtonAction from '@/components/ButtonAction';
import * as Yup from 'yup';
import InputCurrency from '@/components/InputCurrency';
import { IoIosClose } from 'react-icons/io';
import { useAllStorageAreas } from '@/modules/storage-area/repository';
import { StorageAreaOverview, StorageAreaStatus, StorageAreaType } from '@/modules/storage-area/interface';
import Search from '@/components/Search';
import { sumBy } from 'lodash';

export interface LocationAllocation {
    id: number;
    code: string;
    name: string;
    quantity: number;
}

type ModalAddCategoryProps = {
    onClose: () => void;
    totalQuantity: number;
    onSubmit: (allocations: LocationAllocation[]) => void;
    locations: LocationAllocation[];
}

interface FormValues {
    allocations: LocationAllocation[];
}

const validationSchema = (totalQuantity: number) => Yup.object().shape({
    allocations: Yup.array()
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
}

const FormikContent = ({ onClose, totalQuantity }: FormikContentProps) => {
    const { values, setFieldValue, errors, submitForm } = useFormikContext<FormValues>();
    const [showListStorageArea, setShowListStorageArea] = useState<boolean>(false);
    const [storageAreaSearchTerm, setStorageAreaSearchTerm] = useState<string>('');

    const storageAreaQuery = useAllStorageAreas({
        name: storageAreaSearchTerm,
        status: StorageAreaStatus.ACTIVE,
        type: StorageAreaType.MATERIAL,
    });

    const availableStorageArea = React.useMemo(() => {
        if (!storageAreaQuery.data) return [];

        return storageAreaQuery.data.data.filter(area => {
            return !values.allocations.find(a => a.id === area.id);
        });
    }, [storageAreaQuery.data, values.allocations]);

    const handleAddStorageArea = (item: StorageAreaOverview) => {
        const isExist = values.allocations.find(a => a.id === item.id);
        if (!isExist) {
            const newLocation: LocationAllocation = {
                id: item.id,
                code: item.code,
                name: item.name,
                quantity: values.allocations.length === 0 ? totalQuantity : 0,
            };
            setFieldValue('allocations', [...values.allocations, newLocation]);
        }
        setShowListStorageArea(false);
    };

    return (
        <Form>
            <div className="flex gap-5 mt-3">
                <div>Tổng số lượng cần phân bổ: {totalQuantity}</div>
                <div>|</div>
                <div>Còn lại: {totalQuantity - sumBy(values.allocations, 'quantity')}</div>
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
                                <div className={`px-3 py-2 first:border-t-0 border-t cursor-pointer hover:bg-gray-100`}
                                     onClick={() => onSelect(item)}>
                                    #{item.code} - {item.name}
                                </div>
                            )}
                    />
                </div>
                <div className="mt-5 ">
                    <FieldArray name="allocations"
                                render={arrayHelpers => (
                                    <div className="mt-1 border rounded p-2">
                                        {
                                            errors.allocations && typeof errors.allocations === 'string' && (
                                                <div className="text-red-500 text-sm">{errors.allocations}</div>
                                            )
                                        }
                                        {
                                            values.allocations.length > 0 ? (
                                                <div className="space-y-3">
                                                    {
                                                        values.allocations.map((allocation, index) => (
                                                            <div key={`warehouse-${index}`}
                                                                 className="flex flex-col justify-center border rounded h-14">
                                                                <div className="flex justify-between items-center px-3">
                                                                    <div className="text-sm w-60 max-w-60">
                                                                        <div>#{allocation.code}</div>
                                                                        <div
                                                                            className="line-clamp-1">{allocation.name}</div>
                                                                    </div>
                                                                    <div>
                                                                        <InputCurrency
                                                                            name={`allocations.${index}.quantity`}
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

const ModalChooseLocation = ({ onClose, totalQuantity, onSubmit, locations }: ModalAddCategoryProps) => {

    const initialValues: FormValues = {
        allocations: locations,
    };

    const handleSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            onSubmit(values.allocations);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal title="Phân bổ số lượng theo vị trí" open={true} onClose={onClose} className="!w-1/3">
                <Formik initialValues={initialValues} onSubmit={handleSubmit}
                        validationSchema={validationSchema(totalQuantity)}>
                    <FormikContent onClose={onClose} totalQuantity={totalQuantity} />
                </Formik>
            </Modal>
        </>
    );
};

export default ModalChooseLocation;