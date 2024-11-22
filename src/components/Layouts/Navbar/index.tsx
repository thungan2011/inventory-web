import React, { useEffect, useState } from 'react';
import Link from '@/components/Link';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { FiAlignJustify } from 'react-icons/fi';
import Dropdown from '@/components/Layouts/Navbar/Dropdown';
import Image from 'next/image';
import avatar from '/public/img/avatar/avt.png';
import Breadcrumb from '../../Breadcrumb';
import { useAuth } from '@/hook/useAuth';

function Navbar() {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        setDarkMode(document.body.classList.contains('dark'));
    }, []);

    return (
        <nav
            className="sticky top-0 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/80 py-0.5 mx-2 dark:bg-[#0b14374d]">
            <Breadcrumb/>

            <div
                className="relative flex flex-grow md:flex-grow-0 items-center justify-around gap-2 xl:gap-3 dark:!bg-navy-800 p-2">

                <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white md:hidden">
                    <FiAlignJustify className="h-5 w-5"/>
                </span>

                <div className="cursor-pointer text-gray-600"
                     onClick={() => {
                         if (darkMode) {
                             document.body.classList.remove('dark');
                             setDarkMode(false);
                         } else {
                             document.body.classList.add('dark');
                             setDarkMode(true);
                         }
                     }}
                >
                    {darkMode ? (
                        <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white"/>
                    ) : <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white"/>}
                </div>

                <Dropdown
                    className="py-2 top-full w-max right-0"
                    button={
                        <div className="relative h-7 w-7">
                            <Image className="rounded-full" src={avatar} alt="Avatar"/>
                        </div>
                    }
                >
                    <div
                        className="flex w-56 flex-col justify-start rounded bg-white bg-cover bg-no-repeat shadow-xl dark:!bg-navy-700 dark:text-white dark:shadow-none">
                        <div className="ml-4 mt-3">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-navy-700 dark:text-white">Hey, {user?.lastName ? user.lastName : 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20"/>

                        <div className="ml-4 mt-3 flex flex-col gap-y-3 mb-3">
                            <Link href="#" className="text-sm text-gray-800 dark:text-white">Thông tin cá nhân</Link>
                            <Link href="#" className="text-sm text-gray-800 dark:text-white">Cài đặt</Link>
                            <button onClick={logout} className="text-sm text-start font-medium text-red-500 dark:text-white">Đăng xuất</button>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
}

export default Navbar;