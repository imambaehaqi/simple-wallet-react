import Skeleton from "./common/Skeleton";
import styles from "./TransactionList.module.css"; // Kita gunakan style yang sama

const TransactionListSkeleton = ({ count = 5 }) => {
  return (
    <div className={styles.listContainer}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={styles.transactionItem}>
            <div className={styles.mainInfo}>
              <div className={styles.details}>
                <Skeleton className={styles.skeletonTitle} />
                <Skeleton className={styles.skeletonSubtitle} />
              </div>
              <Skeleton className={styles.skeletonAmount} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default TransactionListSkeleton;
