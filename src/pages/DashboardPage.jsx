import { useState, useEffect, useCallback } from "react";
import useApi from "../hooks/useApi";
import * as transactionService from "../api/transactionService";

// Component Imports
import Filters from "../components/Filters";
import CategoryChart from "../components/CategoryChart"; // <-- IMPORT CHART
import Button from "../components/common/Button/Button";
import styles from "./DashboardPage.module.css";

// Helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const DashboardPage = () => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [chartData, setChartData] = useState([]); // <-- State baru untuk data chart

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

  // useEffect untuk transformasi data saat `summary` berubah
  useEffect(() => {
    if (summary?.categoryBreakdown) {
      const transformedData = summary.categoryBreakdown.map((cat) => ({
        name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1), // Capitalize
        Income: cat.income,
        Expense: cat.expense,
      }));
      setChartData(transformedData);
    }
  }, [summary]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const clearFilters = () => setFilters({ startDate: "", endDate: "" });

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
              <h3>Current Balance</h3>
              <p>{formatCurrency(summary.currentBalance)}</p>
            </div>
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

          {/* --- Render Chart di sini --- */}
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
    </div>
  );
};

export default DashboardPage;
