import React from 'react';
import Modal from '@/components/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/ButtonAction';
import { Gender, GenderVietnamese, getEnumGender } from '@/modules/base/interface';
import Input from '@/components/Input';
import { User } from '@/modules/authentication/interface';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import Select from '@/components/Select';
import { formatRole } from '@/utils/formatString';
import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';

type ModalProfileProps = {
    onClose: () => void;
    user: User;
}

interface FormValues {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    gender: Gender;
    birthday: Date;
}


const validationSchema = Yup.object().shape({});

const FormikContent = ({ onClose, user }: { onClose: () => void; user: User }) => {
    return (
        <Form>
            <div className="grid grid-cols-4">
                <div className="flex flex-col mt-16 items-center">
                    <div className="relative aspect-square border rounded-full shadow overflow-hidden col-span-1 w-32">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh nhân viên`} fill
                               className="object-cover" />
                    </div>
                    <p className="mt-2">{formatRole(user.role)}</p>
                </div>
                <div className="col-span-3">
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <Input name="firstName" label="Họ đệm" placeholder="Họ đệm" />
                        <Input name="lastName" label="Tên" placeholder="Tên" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <DatePicker name="birthday" label="Sinh nhật" maxDate={dayjs().add(-1, 'day').toDate()} />
                        <Select name="gender" label="Giới tính" options={[
                            ...Object.keys(Gender).map(data => (
                                { label: GenderVietnamese[data as Gender], value: data }
                            )),
                        ]} />
                    </div>
                    <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại" />
                    <Input name="email" label="Email" placeholder="Email" />

                    <div className="flex justify-end items-center gap-3 mt-3">
                        <ButtonAction.Cancel onClick={onClose} />
                        <ButtonAction.Submit />
                    </div>
                </div>
            </div>
        </Form>
    );
};

const ModalProfile = ({ onClose, user }: ModalProfileProps) => {
    /**
     * React query
     */


    const initialValues: FormValues = {
        lastName: user.lastName,
        firstName: user.firstName,
        birthday: user.birthday,
        gender: getEnumGender(user.gender),
        phone: user.phone,
        email: user.email,
    };

    const handleSubmit = async (values: FormValues) => {
        console.table(values);
        try {
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal title="Thông tin cá nhân" open={true} onClose={onClose} className="!w-1/2">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                <FormikContent onClose={onClose} user={user} />
            </Formik>
        </Modal>
    );
};

export default ModalProfile;