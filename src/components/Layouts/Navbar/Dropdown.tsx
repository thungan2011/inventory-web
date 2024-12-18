import React, {useRef, useState} from 'react';
import useClickOutside from '@/hook/useClickOutside';

type DropdownProps = {
    button: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const Dropdown = (props : DropdownProps) => {
    const { button, children, className } = props;
    const wrapperRef  = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [openWrapper, setOpenWrapper] = useState<boolean>(false);
    useClickOutside(dropdownRef, () => setOpenWrapper(false));
    return (
        <div className="relative flex" ref={wrapperRef}>
            <div className="flex " onMouseDown={() => setOpenWrapper(!openWrapper)}>
                {button}
            </div>
            <div ref={dropdownRef} className={`${className} absolute z-10 origin-top-left transition-all duration-300 ease-in-out ${openWrapper ? 'scale-100' :  'scale-0'}`}>
                {children}
            </div>
        </div>
    );
};

export default Dropdown;