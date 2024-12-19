import { useContext } from 'react';
import { AbilityContext } from '@/context/AbilityContext';

export const useAbility = () => {
    const context = useContext(AbilityContext);
    if (!context) {
        throw new Error('useAbility must be used within AbilityProvider');
    }
    return context;
};