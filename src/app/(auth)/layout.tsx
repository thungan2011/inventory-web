import type { Metadata } from 'next';
import React from 'react';
import FixedPlugin from '../../components/FixedPlugin';

export const metadata: Metadata = {
    title: 'Nut Gradient | Auth',
    description: 'Nut Garden',
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative float-right h-screen min-h-screen w-full dark:!bg-navy-900">
            <div className="mx-auto h-full min-h-screen">
                <FixedPlugin />
                {children}
            </div>
        </div>
    );
}
