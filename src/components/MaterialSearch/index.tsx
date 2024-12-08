import React, { useRef } from 'react';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import useClickOutside from '@/hook/useClickOutside';
import { MaterialOverview } from '@/modules/materials/interface';

interface MaterialSearchDropdownProps {
    materials: MaterialOverview[];
    onSelect: (material: MaterialOverview) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    renderProduct?: (product: MaterialOverview, onSelect: (product: MaterialOverview) => void) => React.ReactNode;
}

const DefaultMaterialItem = ({ material, onSelect }: {
    material: MaterialOverview,
    onSelect: (material: MaterialOverview) => void
}) => {
    return (
        <div className="p-2 hover:bg-gray-100 cursor-pointer border-t first:border-t-0"
             onClick={() => onSelect(material)}>
            <div className="flex gap-3">
                <div className="relative w-12 h-12 rounded border overflow-hidden">
                    <Image
                        src={LOGO_IMAGE_FOR_NOT_FOUND}
                        alt={`Ảnh thành phẩm ${material.name}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-sm font-medium line-clamp-1">
                        #{material.sku} - {material.name}
                    </div>
                    <div className="text-xs flex items-center gap-2">
                        <div>
                            Loại: {material.packing}
                        </div>
                        <div>|</div>
                        <div>
                            Tồn kho khả dụng: {material.quantityAvailable}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <button type="button" className="text-brand-500">
                        <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    );
};

const MaterialSearchDropdown = ({ materials, onSelect, dropdownRef, renderProduct }: MaterialSearchDropdownProps) => {
    if (materials.length === 0) {
        return (
            <div className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border">
                <div className="text-center text-gray-400 py-2">
                    Không tìm thấy sản phẩm nào
                </div>
            </div>
        );
    }

    return (
        <div ref={dropdownRef}
             className="absolute z-10 left-0 right-0 py-2 bg-white shadow-lg rounded max-h-72 border overflow-auto">
            {materials.map(material => (
                renderProduct ?
                    renderProduct(material, onSelect) :
                    <DefaultMaterialItem
                        key={material.id}
                        material={material}
                        onSelect={onSelect}
                    />
            ))}
        </div>
    );
};

interface ProductSearchProps {
    className?: string;
    inputClassName?: string;
    onSearchChange: (value: string) => void;
    onSelect: (product: MaterialOverview) => void;
    onShowDropdownChange: (show: boolean) => void;
    placeholder?: string;
    materials: MaterialOverview[];
    renderProduct?: (product: MaterialOverview, onSelect: (product: MaterialOverview) => void) => React.ReactNode;
    searchValue: string;
    showDropdown: boolean;
}

const MaterialSearch = ({
                           className = 'relative w-[500px]',
                           inputClassName = 'border rounded h-8 px-2 text-sm w-full',
                           onSearchChange,
                           onSelect,
                           onShowDropdownChange,
                           placeholder = 'Tìm theo tên nguyên liệu',
                           materials,
                           renderProduct,
                           searchValue,
                           showDropdown,
                       }: ProductSearchProps) => {
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
                <MaterialSearchDropdown
                    materials={materials}
                    onSelect={onSelect}
                    dropdownRef={dropdownRef}
                    renderProduct={renderProduct}
                />
            )}
        </div>
    );
};

export default MaterialSearch;