import { ProductOverview } from '@/modules/products/interface';
import React, { useRef } from 'react';
import { LOGO_IMAGE_FOR_NOT_FOUND } from '@/variables/images';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import useClickOutside from '@/hook/useClickOutside';

interface ProductSearchDropdownProps {
    products: ProductOverview[];
    onSelect: (product: ProductOverview) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    renderProduct?: (product: ProductOverview, onSelect: (product: ProductOverview) => void) => React.ReactNode;
}

const DefaultProductItem = ({ product, onSelect }: {
    product: ProductOverview,
    onSelect: (product: ProductOverview) => void
}) => {
    return (
        <div className="p-2 hover:bg-gray-100 cursor-pointer"
             onClick={() => onSelect(product)}>
            <div className="flex gap-3">
                <div className="relative w-12 h-12 rounded border overflow-hidden">
                    <Image
                        src={LOGO_IMAGE_FOR_NOT_FOUND}
                        alt={`Ảnh thành phẩm ${product.name}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-sm font-medium line-clamp-1">
                        #{product.sku} - {product.name}
                    </div>
                    <div className="text-xs line-clamp-1">
                        {product.packing}
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

const ProductSearchDropdown = ({ products, onSelect, dropdownRef, renderProduct }: ProductSearchDropdownProps) => {
    if (products.length === 0) {
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
            {products.map(product => (
                renderProduct ?
                    renderProduct(product, onSelect) :
                    <DefaultProductItem
                        key={product.id}
                        product={product}
                        onSelect={onSelect}
                    />
            ))}
        </div>
    );
};

interface ProductSearchProps {
    onSelect: (product: ProductOverview) => void;
    products: ProductOverview[];
    searchValue: string;
    onSearchChange: (value: string) => void;
    showDropdown: boolean;
    onShowDropdownChange: (show: boolean) => void;
    renderProduct?: (product: ProductOverview, onSelect: (product: ProductOverview) => void) => React.ReactNode;
    className?: string;
    inputClassName?: string;
    placeholder?: string;
}

const ProductSearch = ({
                           onSelect,
                           products,
                           searchValue,
                           onSearchChange,
                           showDropdown,
                           onShowDropdownChange,
                           renderProduct,
                           className = 'relative w-[500px]',
                           inputClassName = 'border rounded h-8 px-2 text-sm w-full',
                           placeholder = 'Tìm theo tên hoặc mã sản phẩm',
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
                <ProductSearchDropdown
                    products={products}
                    onSelect={onSelect}
                    dropdownRef={dropdownRef}
                    renderProduct={renderProduct}
                />
            )}
        </div>
    );
};

export default ProductSearch;