export interface PageObject<T> {
    data: T[];
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
}