import styles from "./TransactionList.module.css";
import Button from "./common/Button/Button";
// -- IMPORT FUNGSI FORMATTER --
import { formatCurrency, formatDate } from "../utils/formatters";

const TransactionList = ({ transactions, onEdit, onDelete, disabled }) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className={styles.noTransactions}>
        <h3>No Transactions Found</h3>
        <p>Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {transactions.map((tx) => (
        <div key={tx.id} className={styles.transactionItem}>
          <div className={styles.mainInfo}>
            <div className={styles.details}>
              <span className={styles.title}>{tx.title}</span>
              <span className={styles.category}>{tx.category}</span>
              {/* -- GUNAKAN FUNGSI DI SINI -- */}
              <span className={styles.date}>{formatDate(tx.createdAt)}</span>
            </div>
            <div
              className={`${styles.amount} ${
                tx.type === "income" ? styles.income : styles.expense
              }`}
            >
              {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => onEdit(tx)}
              disabled={disabled}
            >
              Edit
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => onDelete(tx.id)}
              disabled={disabled}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
