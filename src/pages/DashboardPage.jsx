import { useState, useEffect, useCallback } from "react";
import useApi from "../hooks/useApi";
import * as transactionService from "../api/transactionService";

// Component Imports
import Filters from "../components/Filters";
import CategoryChart from "../components/CategoryChart";
import TopUpModal from "../components/TopUpModal"; // <-- IMPORT MODAL BARU
import Button from "../components/common/Button/Button";
import styles from "./DashboardPage.module.css";
import { formatCurrency } from "../utils/formatters"; // <-- IMPORT FORMATTER

const DashboardPage = () => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [chartData, setChartData] = useState([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false); // <-- State untuk modal

  const {
    data: summary,
    error,
    loading,
    request: fetchSummary,
  } = useApi(transactionService.getSummary);

  const loadSummary = useCallback(() => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    fetchSummary(params);
  }, [fetchSummary, filters]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (summary?.categoryBreakdown) {
      const transformedData = summary.categoryBreakdown.map((cat) => ({
        name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
        Income: cat.income,
        Expense: cat.expense,
      }));
      setChartData(transformedData);
    }
  }, [summary]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const clearFilters = () => setFilters({ startDate: "", endDate: "" });

  // Fungsi ini akan dipanggil oleh TopUpModal setelah sukses
  const handleTopUpSuccess = () => {
    loadSummary(); // Muat ulang data dashboard untuk menampilkan saldo baru
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <Button onClick={clearFilters} variant="secondary">
          Reset Date Filters
        </Button>
      </div>

      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        showCategoryFilter={false}
      />

      {loading && (
        <div className={styles.centered}>Loading dashboard data...</div>
      )}
      {error && (
        <div className={`${styles.centered} ${styles.error}`}>
          Error fetching summary: {error}
        </div>
      )}

      {summary && !loading && (
        <>
          <div className={styles.summaryGrid}>
            <div className={`${styles.card} ${styles.balance}`}>
              <div className={styles.balanceHeader}>
                <h3>Current Balance</h3>
                {/* --- TOMBOL TOP UP --- */}
                <Button
                  variant="primary"
                  onClick={() => setIsTopUpModalOpen(true)}
                >
                  Top Up
                </Button>
              </div>
              <p>{formatCurrency(summary.currentBalance)}</p>
            </div>
            {/* ... card lainnya ... */}
            <div className={`${styles.card} ${styles.income}`}>
              <h3>Total Income (Filtered)</h3>
              <p>{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className={`${styles.card} ${styles.expense}`}>
              <h3>Total Expense (Filtered)</h3>
              <p>{formatCurrency(summary.totalExpense)}</p>
            </div>
            <div className={`${styles.card} ${styles.netflow}`}>
              <h3>Net Flow (Filtered)</h3>
              <p
                className={
                  summary.netFlow >= 0 ? styles.incomeText : styles.expenseText
                }
              >
                {formatCurrency(summary.netFlow)}
              </p>
            </div>
          </div>

          <CategoryChart data={chartData} />

          {chartData.length === 0 && (
            <div className={styles.noData}>
              <p>
                No transaction data to display in chart for the selected period.
              </p>
            </div>
          )}
        </>
      )}

      {/* --- RENDER MODAL DI SINI --- */}
      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onSuccess={handleTopUpSuccess}
      />
    </div>
  );
};

export default DashboardPage;
