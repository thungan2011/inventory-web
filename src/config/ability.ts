import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { ROLE_ADMIN, ROLE_EMPLOYEE_SALE, ROLE_WAREHOUSE_KEEPER } from '@/modules/authentication/interface';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects =
    'Order'
    | 'Product'
    | 'User'
    | 'all'
    | 'Employee'
    | 'Dashboard'
    | 'Provider'
    | 'Category'
    | 'History'
    | 'InventoryCheck'
    | 'Stock'
    | 'StorageArea'
    | 'Material'
    | 'Import'
    | 'Export'
    | 'Customer';
export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(role: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    switch (role) {
        case ROLE_ADMIN:
            can('manage', 'all');
            break;
        case ROLE_EMPLOYEE_SALE:
            can(['manage'], ['Dashboard', 'History', 'Order', 'Provider', 'Stock', 'StorageArea', 'Customer', 'Material', 'Product']);
            cannot(['manage'], ['Employee', 'Import', 'Export']);
            break;
        case ROLE_WAREHOUSE_KEEPER:
            can(['manage'], ['Dashboard', 'History', 'Stock', 'StorageArea', 'Customer', 'Import', 'Export']);
            can([], []);
            cannot(['manage'], ['Employee', 'InventoryCheck']);
            cannot('delete', 'all');
            break;
    }

    return build();
}