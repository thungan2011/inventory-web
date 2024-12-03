import React, { useRef } from 'react';
import useClickOutside from '@/hook/useClickOutside';

interface SearchDropdownProps<T> {
    items: T[];
    onSelect: (item: T) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    renderItem: (item: T, onSelect: (item: T) => void) => React.ReactNode;
}

const SearchDropdown = <T,>({ items, onSelect, dropdownRef, renderItem }: SearchDropdownProps<T>) => {
    if (items.length === 0) {
        return (
            <div ref={dropdownRef} className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border">
                <div className="text-center text-gray-400 py-2">
                    Không tìm thấy
                </div>
            </div>
        );
    }

    return (
        <div ref={dropdownRef}
             className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border overflow-auto">
            {items.map((item, index) => (
                <div key={`search-item-${index}`}>
                    {renderItem(item, onSelect)}
                </div>
            ))}
        </div>
    );
};

interface SearchProps<T> {
    onSelect: (item: T) => void;
    items: T[];
    searchValue: string;
    onSearchChange: (value: string) => void;
    showDropdown: boolean;
    onShowDropdownChange: (show: boolean) => void;
    renderItem: (item: T, onSelect: (item: T) => void) => React.ReactNode;
    className?: string;
    inputClassName?: string;
    placeholder?: string;
}

const Search = <T,>({
                           onSelect,
                           items,
                           searchValue,
                           onSearchChange,
                           showDropdown,
                           onShowDropdownChange,
                           renderItem,
                           className = 'relative w-full',
                           inputClassName = 'border rounded h-8 px-2 text-sm w-full',
                           placeholder = 'Tìm theo tên hoặc mã sản phẩm',
                       }: SearchProps<T>) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => onShowDropdownChange(false));

    return (
        <div className={className}>
            <input
                className={inputClassName}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={() => onShowDropdownChange(true)}
                placeholder={placeholder}
            />
            {showDropdown && (
                <SearchDropdown<T>
                    items={items}
                    onSelect={onSelect}
                    dropdownRef={dropdownRef}
                    renderItem={renderItem}
                />
            )}
        </div>
    );
};

export default Search;