'use client';
import React from 'react';
import { InputFieldValidation } from '@/components/Fields';
import Image from 'next/image';
import { LoginCredentials } from '@/modules/authentication/interface';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '@/modules/authentication/repository';
import { useRouter } from 'next/navigation';
import { LuLoader2 } from 'react-icons/lu';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().min(8, 'Mật khẩu tối thiểu là 8 ký tự').required('Mật khẩu là bắt buộc')
});

const Login = () => {
    const router = useRouter();
    const initialValues: LoginCredentials = {
        email: 'thunganngan123456@gmail.com',
        password: '12345678',
    };

    const loginCall = useLogin();

    const handleLogin = async (values: LoginCredentials) => {
        try {
            await loginCall.mutateAsync(values);
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-wrap items-center h-full">
            <div className="hidden xl:block xl:w-1/2 h-full">
                <div
                    className="relative overflow-hidden px-24 py-16 text-center h-full rounded-br-[200px] rounded-tl-[200px]"
                >
                    <div className="absolute inset-0 z-0">
                        <div className="relative w-full h-full">
                            <Image src={'/img/auth/bg.jpg'} alt={'B&Q Cinema'} fill className="object-cover" sizes='100vw' />
                        </div>
                    </div>
                    <div className="relative z-20">
                        <div className="flex items-center justify-center text-white">
                            <div
                                className="uppercase font-poppins text-[36px] font-bold">
                                Nut Garden
                            </div>
                        </div>

                        <p className="2xl:px-20 text-white text-sm mt-5">
                            Nut Garden là đơn vị chuyên cung các loại đặc sản vùng Tây Nguyên có giấy kiểm định chất lượng và vệ sinh an toàn thực phẩm. Cam kết sản phẩm thật - sản phẩm nguyên chất
                        </p>

                        <div className="flex items-center justify-center mt-10">
                            <Image src={'/img/auth/bg.svg'} alt={'B&Q Cinema'} width={350} height={350} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full xl:w-1/2">
                <div className="w-full p-4 sm:p-[3.125rem] xl:p-[4.375rem]">
                    <h2 className="text-2xl mb-2 font-bold dark:text-white sm:text-[33px] leading-10 text-center xl:text-start">
                        Đăng nhập
                    </h2>

                    <p className="text-sm text-gray-600 mb-9 dark:text-white">
                        Nhập email và mật khẩu của bạn phía dưới
                    </p>

                    <Formik initialValues={initialValues} onSubmit={handleLogin} validationSchema={LoginSchema}>
                        <Form>
                            <InputFieldValidation label="Email *" name="email"
                                                  type="text" placeholder="mail@gmail.com" extra="mb-5" />
                            <InputFieldValidation label="Mật khẩu *" name="password"
                                                  type="password" placeholder="Tối thiểu 8 ký tự" extra="mb-5" />

                            <button type="submit"
                                    disabled={loginCall.isPending}
                                    className="mt-5 w-full flex gap-2 justify-center items-center rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                {loginCall.isPending && (<LuLoader2 className="h-5 w-5 animate-spin"/>)}
                                {loginCall.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;