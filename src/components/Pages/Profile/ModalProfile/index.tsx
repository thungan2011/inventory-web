import React from 'react';
import Modal from '@/components/Modal';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonAction from '@/components/ButtonAction';
import { Gender, GenderVietnamese } from '@/modules/base/interface';
import Input from '@/components/Input';
import { User } from '@/modules/authentication/interface';
import Image from 'next/image';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import Select from '@/components/Select';

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
            <div>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative aspect-square rounded-full shadow overflow-hidden col-span-1 w-32">
                        <Image src={LOGO_IMAGE_FOR_NOT_FOUND} alt={`Ảnh nhân viên`} fill
                               className="object-cover" />
                    </div>
                    <p className="mt-2">{user.role}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <Input name="firstName" label="Họ đệm" placeholder="Họ đệm" />
                    <Input name="lastName" label="Tên" placeholder="Tên" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input name="birthday" label="Sinh nhật" placeholder="Sinh nhật" />
                    <Select name="gender" label="Giới tính" options={[
                        ...Object.keys(Gender).map(data => (
                            { label: GenderVietnamese[data as Gender], value: data }
                        )),
                    ]} />
                </div>
                <Input name="phone" label="Số điện thoại" placeholder="Số điện thoại" />
                <Input name="email" label="Email" placeholder="Email" />
            </div>

            <div className="flex justify-end items-center gap-3 mt-3">
                <ButtonAction.Cancel onClick={onClose} />
                <ButtonAction.Submit />
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
        gender: user.gender ? Gender.MALE : Gender.FEMALE,
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