import { createContext, ReactNode } from 'react';
import { AppAbility, defineAbilityFor } from '@/config/ability';

export const AbilityContext = createContext<AppAbility | null>(null);

interface AbilityProviderProps {
    children: ReactNode;
    role: string;
}

export function AbilityProvider({ children, role } : AbilityProviderProps) {
    const ability = defineAbilityFor(role);

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
}

export default AbilityProvider;