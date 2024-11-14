import { BaseStatus } from '@/modules/base/interface';

/**
 * Base
 */
const baseStatusLabels: Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'Hoạt động',
    [BaseStatus.INACTIVE]: 'Không hoạt động',
};




export {
    baseStatusLabels,
};