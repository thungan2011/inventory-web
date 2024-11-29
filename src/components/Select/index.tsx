import Tooltip from '@/components/Tooltip';
import { ErrorMessage, useField } from 'formik';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosSearch, IoMdCloseCircle } from 'react-icons/io';
import useClickOutside from '@/hook/useClickOutside';
import { MdOutlineCheck } from 'react-icons/md';
import { useDebounceValue } from 'usehooks-ts';


type Option = {
    value: string | number;
    label: string;
    id?: string;
}

export type SelectProps = {
    name: string;
    label?: string;
    tooltip?: string;
    placeholder?: string;
    multiple?: boolean;
    options: Option[];
    disabled?: boolean;
    onChange?: (option: Option) => void;
    required?: boolean;

    enableSearch?: boolean;
    onSearch?: (search: string) => void;
    searchPlaceholder?: string;
    isLoading?: boolean;
}

const Select = ({
                    name,
                    label,
                    tooltip,
                    multiple,
                    options,
                    placeholder = 'Lựa chọn',
                    required = false,
                    disabled = false,
                    onChange,

                    enableSearch = false,
                    onSearch,
                    searchPlaceholder = 'Tìm kiếm...',
                    isLoading = false,
                }: SelectProps) => {
    const id = useId();
    const [field, , helpers] = useField(name);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [showClearButton, setShowClearButton] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const valueContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedValues = multiple ? (Array.isArray(field.value) ? field.value : []) : (field.value ? [field.value] : []);
    const selectedOptions = options.filter(option => selectedValues.includes(option.value));

    const [debouncedSearchValue] = useDebounceValue<string>(searchValue, 300);

    const closeDropdown = useCallback(() => {
        setIsDropdownOpen(false);
        setSearchValue('');
    }, []);

    const toggleDropdown = useCallback(() => {
        if (!disabled) {
            setIsDropdownOpen(prev => !prev);
        }
    }, [disabled]);

    const handleOptionSelect = useCallback((option: Option) => {
        if (disabled) return;

        if (multiple) {
            const newValues = selectedValues.includes(option.value)
                ? selectedValues.filter(v => v !== option.value)
                : [...selectedValues, option.value];
            helpers.setValue(newValues);
        } else {
            helpers.setValue(option.value);
            setIsDropdownOpen(false);
        }
        onChange?.(option);
    }, [disabled, multiple, selectedValues, helpers, onChange]);

    const removeOption = useCallback((e: React.MouseEvent, valueToRemove: string | number) => {
        e.stopPropagation();
        if (!disabled && multiple) {
            helpers.setValue(selectedValues.filter(value => value !== valueToRemove));
        }
    }, [disabled, multiple, helpers, selectedValues]);

    const clearSelection = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disabled && multiple) {
            helpers.setValue([]);
        }
    }, [disabled, multiple, helpers]);

    useClickOutside<HTMLDivElement>(dropdownRef, closeDropdown);

    useEffect(() => {
        if (isDropdownOpen && enableSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isDropdownOpen, enableSearch]);

    useEffect(() => {
        if (onSearch && debouncedSearchValue) {
            onSearch(debouncedSearchValue);
        }
    }, [debouncedSearchValue, onSearch]);

    const renderValue = () => (
        <div ref={valueContainerRef}
             className={`flex-1 flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-text'} gap-2 overflow-hidden flex-wrap`}>
            {
                selectedOptions.length > 0 ? (
                    selectedOptions.map(option => (
                        multiple ? (
                            <div key={option.value}
                                 className="flex items-center gap-x-1 border rounded px-1 text-xs py-1 bg-brand-50">
                                <span className="text-nowrap text-xs cursor-default">{option.label}</span>
                                {
                                    !disabled && (
                                        <button
                                            type="button"
                                            onClick={(e) => removeOption(e, option.value)}
                                            className="text-[10px] text-gray-400 hover:text-gray-900"
                                        >
                                            x
                                        </button>
                                    )
                                }
                            </div>
                        ) : (
                            <div key={option.value} className="text-xs">
                                {option.label}
                            </div>
                        )
                    ))
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )
            }
        </div>
    );

    const renderDropdownOptions = () => (
        <div>
            {
                options.map(option => (
                    <div key={option.value}
                         className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm select-none flex items-center justify-between gap-x-2`}
                         onClick={(e) => {
                             e.stopPropagation();
                             handleOptionSelect(option);
                         }}
                    >
                        {option.label}
                        {
                            selectedValues.includes(option.value) && (
                                <MdOutlineCheck className="text-brand-500" />
                            )
                        }
                    </div>
                ))
            }
        </div>
    );

    const renderSearchInput = () => (
        <div className="sticky top-0 p-2 bg-white border-b">
            <div className="relative">
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                    className="w-full pl-8 pr-2 py-1.5 border rounded text-sm"
                    placeholder={searchPlaceholder}
                    onClick={e => e.stopPropagation()}
                />
                <IoIosSearch
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400
                        ${isLoading ? 'animate-spin' : ''}`}
                />
            </div>
        </div>
    );

    return (
        <div className="mb-3">
            {
                label && (
                    <div className="mb-1 inline-flex gap-x-1 h-6">
                        <label className="font-normal text-sm cursor-pointer after:content-[':']"
                               onClick={toggleDropdown}
                               htmlFor={id}
                               title={label}
                        >
                            {label}
                        </label>
                        {required && <span className="text-red-500 text-xs">*</span>}
                        {tooltip && <Tooltip text={tooltip} />}
                    </div>
                )
            }
            <div
                ref={dropdownRef}
                onClick={toggleDropdown}
                onMouseEnter={() => setShowClearButton(true)}
                onMouseLeave={() => setShowClearButton(false)}
                className={`border rounded-md min-h-10 py-1 px-3 dark:text-white dark:bg-navy-900 w-full focus-within:border-brand-500 flex items-center group relative ${disabled ? 'cursor-not-allowed' : ''}`}
            >
                {renderValue()}
                {
                    !disabled && (
                        multiple && selectedValues.length > 0 && showClearButton ? (
                            <button onClick={clearSelection}
                                    type="button"
                                    className="text-gray-400 hover:text-gray-900"
                            >
                                <IoMdCloseCircle />
                            </button>
                        ) : (
                            <IoIosArrowDown
                                className={` transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                        )
                    )
                }

                {
                    !disabled && isDropdownOpen && (
                        <div
                            className="absolute mt-1 left-0 top-full z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                        >
                            {enableSearch && renderSearchInput()}
                            {renderDropdownOptions()}
                        </div>
                    )
                }
            </div>

            <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default Select;