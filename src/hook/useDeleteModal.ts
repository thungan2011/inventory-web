import { useState } from 'react';
import { toast } from 'react-toastify';

interface UseDeleteModalReturn<T> {
    showDeleteModal: boolean;
    selectedData: T | null;
    openDeleteModal: (data: T) => void;
    closeDeleteModal: () => void;
    handleDelete: () => Promise<void>;
}

interface DeleteValidation<T> {
    condition: (data: T) => boolean;
    message: string;
}

interface UseDeleteModalProps<T> {
    onDelete: (data: T) => Promise<void>;
    onSuccess?: () => void;
    canDelete?: (data: T) => boolean;
    unableDeleteMessage?: string;

    validations?: DeleteValidation<T>[];
}

function useDeleteModal<T>({
                               onDelete,
                               onSuccess,
                               unableDeleteMessage = 'Không thể xóa',
                               canDelete,
                               validations = [],
                           }: UseDeleteModalProps<T>): UseDeleteModalReturn<T> {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<T | null>(null);

    const openDeleteModal = (data: T) => {
        for (const validation of validations) {
            if (!validation.condition(data)) {
                toast.error(validation.message);
                return;
            }
        }

        if (canDelete && !canDelete(data)) {
            toast.error(unableDeleteMessage);
            return;
        }

        setSelectedData(data);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedData(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedData) return;
        try {
            await onDelete(selectedData);
            closeDeleteModal();
            onSuccess?.();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return {
        showDeleteModal,
        selectedData,
        openDeleteModal,
        closeDeleteModal,
        handleDelete,
    };

}

export default useDeleteModal;