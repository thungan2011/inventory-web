'use client';
import React, { useId } from 'react';
import dynamic from 'next/dynamic';
import { ErrorMessage, Field } from 'formik';

type InputFieldValidationProps = {
    label: string;
    extra?: string;
    placeholder: string;
    disabled?: boolean;
    type?: string;
    name: string;
}

const InputFieldValidation = (props: InputFieldValidationProps) => {
    const { label, extra, placeholder, type, disabled, name } = props;
    const id = useId();
    return (
        <div className={`${extra}`}>
            <label
                htmlFor={id}
                className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}
            >
                {label}
            </label>
            <Field
                id={id}
                name={name}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                className={`mt-2 block w-full p-3 text-sm outline-none bg-white/0 border rounded-xl dark:text-white`}
            />
            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default dynamic(() => Promise.resolve(InputFieldValidation), { ssr: false });