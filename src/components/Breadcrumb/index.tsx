import React from 'react';
import Link from '@/components/Link';
import { usePathname } from 'next/navigation';
import { breadcrumbs } from '@/routes/breadcrumbs';
import { MdNavigateNext } from 'react-icons/md';

const Breadcrumb = () => {
    const pathname = usePathname();

    const isMath = (pattern: string): boolean => {
        const regex = new RegExp(pattern);
        return regex.test(pathname);
    };

    const matchedBreadcrumb = breadcrumbs.find(breadcrumb => isMath(breadcrumb.link));

    return (
        <div className="ml-[6px]">
            <div className="h-6 pt-1 flex items-center gap-x-2">
                {
                    matchedBreadcrumb?.breadcrumbTrail.map((trail, index) => (
                        <React.Fragment key={trail.label + index}>
                            {index > 0 && <MdNavigateNext className="text-navy-700" />}
                            {index === matchedBreadcrumb?.breadcrumbTrail.length - 1 ? (
                                <div className="text-brand-500 text-sm font-nunito dark:text-white">{trail.label}</div>
                            ) : trail.link ? (
                                <Link href={trail.link}
                                      className="text-sm font-nunito text-navy-700 hover:underline dark:text-white">
                                    {trail.label}
                                </Link>
                            ) : (
                                <div className="text-sm font-nunito text-navy-700 dark:text-white">
                                    {trail.label}
                                </div>
                            )}
                        </React.Fragment>
                    ))
                }
            </div>
            <p className="shrink text-[33px] font-nunito font-bold text-navy-700 dark:text-white ">
                {matchedBreadcrumb?.label}
            </p>
        </div>
    );
};

export default Breadcrumb;