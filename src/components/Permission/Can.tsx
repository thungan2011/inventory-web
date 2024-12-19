import { ReactNode } from 'react';
import { useAbility } from '@/hook/useAbility';
import { Actions, Subjects } from '@/config/ability';

interface CanProps {
    I: Actions;
    a: Subjects;
    children: ReactNode;
}

export function Can({ I, a, children }: CanProps) {
    const ability = useAbility();

    if (!ability.can(I, a)) {
        return null;
    }

    return children;
}