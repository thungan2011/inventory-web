import React, {useState} from 'react';
import SidebarLink from "@/components/Layouts/Sidebar/SidebarLink";
import routes from '@/routes/adminRoutes';
import SidebarLinkDropdown from "@/components/Layouts/Sidebar/SidebarLinkDropdown";
import { Can } from '@/components/Permission/Can';

const Sidebar = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleToggle = (path: string) => {
        if (path === openDropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(openDropdown === path ? null : path);
        }
    };

    return (
        <aside
            className={`hidden md:flex duration-100 fixed !z-50 h-screen max-h-screen flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0`}>
            <div className="mx-[25px] mt-[50px] flex items-center">
                <div
                    className="ml-1 mt-1 h-2.5 font-poppins text-[20px] font-bold uppercase text-navy-700 dark:text-white">
                    Nut Garden <span className="font-medium text-[15px]">Admin</span>
                </div>
            </div>
            <div className="mb-7 mt-[50px] h-px bg-gray-300 dark:bg-white/30"></div>

            <div className="no-scrollbar overflow-y-auto duration-300 ease-linear">
                <nav className="p-3 ">
                    <div className="text-sm font-semibold ml-4 mb-3 text-brand-500 dark:text-white">MENU</div>
                    <ul className="flex flex-col gap-y-2">
                        {
                            routes.map((route) => {
                                if (route.children) {
                                    return (
                                        <Can key={route.path} I={"read"} a={route.subject || "all"}>
                                            <SidebarLinkDropdown route={route}
                                                                 open={openDropdown === route.path}
                                                                 onToggle={() => handleToggle(route.path)}/>
                                        </Can>
                                    );
                                } else {
                                    return (
                                        <Can key={route.path} I={"read"} a={route.subject || "all"}>
                                            <SidebarLink name={route.name} path={route.path}
                                                         icon={route.icon}/>
                                        </Can>
                                    );
                                }
                            })
                        }
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;