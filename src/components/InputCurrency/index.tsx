import { ErrorMessage, useField } from 'formik';
import React, { useId } from 'react';
import Tooltip from '@/components/Tooltip';

type InputProps = {
    autoFocus?: boolean;
    className?: string;
    label?: string;
    max?: number;
    min?: number;
    name: string;
    onChange?: (value: number) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    step?: number;
    tooltip?: string;
    unit?: string;
    wrapperClassName?: string;
};

const InputCurrency = ({
                           autoFocus = false,
                           label,
                           max,
                           min,
                           name,
                           onChange,
                           placeholder = '',
                           readOnly = false,
                           required = false,
                           step = 1000,
                           tooltip,
                           unit,
                           wrapperClassName,
                           className = '',
                       }: InputProps) => {
    const id = useId();
    const [field, , helpers] = useField(name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const formatValue = (value: any): string => {
        if (value === '' || value === null || value === undefined) {
            return '';
        }
        if (typeof value !== 'string' && typeof value !== 'number') {
            return '';
        }
        const numericValue = String(value).replace(/\D/g, '');
        return numericValue ? new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : '';
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/\D/g, '');
        await helpers.setValue(rawValue === '' ? '' : Number(rawValue));
        onChange?.(Number(rawValue));
    };

    const handleBlur = () => {
        field.onBlur(name);
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        const currentValue = Number(field.value) || 0;

        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                const increasedValue = currentValue + step;
                const newIncreasedValue = max && increasedValue > max ? max : increasedValue;
                await helpers.setValue(newIncreasedValue);
                onChange?.(newIncreasedValue);
                break;

            case 'ArrowDown':
                event.preventDefault();
                const decreasedValue = currentValue - step;
                const newDecreasedValue = Math.max(decreasedValue, min || 0);
                await helpers.setValue(newDecreasedValue);
                onChange?.(newDecreasedValue);
                break;
        }
    };

    return (
        <div className={wrapperClassName ? wrapperClassName : 'mb-3'}>
            {
                label && (
                    <div className="mb-1 inline-flex gap-x-1 h-6">
                        <label className="font-normal text-sm cursor-pointer after:content-[':']"
                               htmlFor={id} title={label}>{label}</label>
                        {required && <span className="text-red-500">*</span>}

                        {tooltip && <Tooltip text={tooltip} />}
                    </div>
                )
            }
            <div
                onClick={handleContainerClick}
                className={`border rounded-md h-10 px-3 dark:text-white dark:bg-navy-900 w-full text-[14px] focus-within:border-brand-500 flex items-center group ${className}`}>
                <input ref={inputRef}
                       id={id}
                       placeholder={placeholder}
                       className={`flex-1 min-w-16`}
                       type="text"
                       autoFocus={autoFocus}
                       min={min}
                       max={max}
                       readOnly={readOnly}
                       value={formatValue(field.value)}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       onKeyDown={handleKeyDown}
                       autoComplete="off"
                />

                {unit && <span className="text-gray-400 uppercase text-xs">{unit}</span>}
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default InputCurrency;