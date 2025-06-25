import { useState, useEffect, useCallback } from "react";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import * as transactionService from "../api/transactionService";
import { PAGE_SIZE } from "../utils/constants";

// Component Imports
import TransactionList from "../components/TransactionList";
import TransactionListSkeleton from "../components/TransactionListSkeleton";
import TransactionForm from "../components/TransactionForm";
import Filters from "../components/Filters";
import Modal from "../components/common/Modal/Modal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Button from "../components/common/Button/Button";
import styles from "./TransactionsPage.module.css";

const TransactionsPage = () => {
  // ... (semua hook useApi dan state tetap sama) ...
  const {
    data,
    error: fetchError,
    loading: isLoading,
    request: fetchTransactions,
  } = useApi(transactionService.getTransactions);
  const { loading: isCreating, request: createRequest } = useApi(
    transactionService.createTransaction
  );
  const { loading: isUpdating, request: updateRequest } = useApi(
    transactionService.updateTransaction
  );
  const { loading: isDeleting, request: deleteRequest } = useApi(
    transactionService.deleteTransaction
  );
  const { addToast } = useToast();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
  });
  const [pagination, setPagination] = useState({ offset: 0, limit: PAGE_SIZE });

  const transactions = data?.transactions || [];
  const totalTransactions = data?.pagination?.total || 0;

  const loadTransactions = useCallback(() => {
    const params = { ...pagination };
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });
    fetchTransactions(params);
  }, [fetchTransactions, pagination, filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // ... (semua handler lain tetap sama) ...
  const handleFilterChange = (newFilters) => {
    setPagination((p) => ({ ...p, offset: 0 }));
    setFilters(newFilters);
  };
  const handleNextPage = () =>
    setPagination((p) => ({ ...p, offset: p.offset + p.limit }));
  const handlePrevPage = () =>
    setPagination((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }));
  const openFormModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsFormModalOpen(true);
  };
  const closeFormModal = () => {
    setEditingTransaction(null);
    setIsFormModalOpen(false);
  };
  const openConfirmationModal = (id) => {
    setTransactionToDelete(id);
    setIsConfirmModalOpen(true);
  };
  const closeConfirmationModal = () => {
    setTransactionToDelete(null);
    setIsConfirmModalOpen(false);
  };

  // ====================================================================
  // --- BLOK YANG DIPERBARUI ---
  // ====================================================================
  const handleSubmit = async (formData) => {
    const isEditing = !!editingTransaction;
    const action = isEditing ? "updated" : "created";

    try {
      const apiCall = isEditing
        ? updateRequest(editingTransaction.id, formData)
        : createRequest(formData);

      const result = await apiCall;

      // Periksa apakah 'result' ada sebelum mengakses propertinya
      if (result && result.success) {
        closeFormModal();
        loadTransactions();
        addToast(`Transaction ${action} successfully!`, "success");
      } else {
        // Gunakan optional chaining untuk keamanan jika 'result' adalah undefined
        addToast(result?.error || `Failed to ${action} transaction.`, "error");
      }
    } catch (error) {
      // Blok catch ini sebenarnya tidak akan banyak terpakai karena useApi sudah menanganinya,
      // tapi ini adalah praktik yang baik untuk menjaganya sebagai fallback.
      console.error(`Error during transaction ${action}:`, error);
      addToast(
        `An unexpected error occurred while processing the transaction.`,
        "error"
      );
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      const result = await deleteRequest(transactionToDelete);

      closeConfirmationModal();

      if (result && result.success) {
        loadTransactions();
        addToast("Transaction deleted successfully!", "success");
      } else {
        addToast(result?.error || "Failed to delete transaction.", "error");
      }
    } catch (error) {
      console.error("Error during transaction deletion:", error);
      addToast(
        `An unexpected error occurred while deleting the transaction.`,
        "error"
      );
    }
  };
  // ====================================================================
  // --- AKHIR BLOK YANG DIPERBARUI ---
  // ====================================================================

  const isActionInProgress = isCreating || isUpdating || isDeleting;

  // ... (return JSX tidak ada perubahan) ...
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Transactions</h1>
        <Button onClick={() => openFormModal()} disabled={isActionInProgress}>
          + Add Transaction
        </Button>
      </div>
      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <TransactionListSkeleton count={PAGE_SIZE} />
      ) : (
        <>
          {fetchError && <p className={styles.error}>Error: {fetchError}</p>}
          <TransactionList
            transactions={transactions}
            onEdit={openFormModal}
            onDelete={openConfirmationModal}
            disabled={isActionInProgress}
          />
          <div className={styles.pagination}>
            <span>
              Showing {transactions.length > 0 ? pagination.offset + 1 : 0}-
              {pagination.offset + transactions.length} of {totalTransactions}
            </span>
            <div className={styles.paginationButtons}>
              <Button
                onClick={handlePrevPage}
                disabled={pagination.offset === 0 || isLoading}
                variant="secondary"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={
                  pagination.offset + transactions.length >=
                    totalTransactions || isLoading
                }
                variant="secondary"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          initialData={editingTransaction}
          loading={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  );
};

export default TransactionsPage;
