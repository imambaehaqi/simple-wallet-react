import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./CategoryChart.module.css";

// Helper untuk format mata uang di dalam chart tooltip
const formatCurrencyForTooltip = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return null; // Jangan render apa-apa jika tidak ada data
  }

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrencyForTooltip} />
          <Tooltip formatter={formatCurrencyForTooltip} />
          <Legend />
          <Bar dataKey="Expense" fill="#ef4444" />
          <Bar dataKey="Income" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
