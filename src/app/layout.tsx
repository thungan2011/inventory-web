"use client";
import React, { useState } from 'react';
import '@/styles/global.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from '@/context/AuthContext';
import 'react-toastify/dist/ReactToastify.min.css';
import { Bounce, ToastContainer } from 'react-toastify';
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [client] = useState(new QueryClient());
    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={client}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
            <AuthProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            </AuthProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
