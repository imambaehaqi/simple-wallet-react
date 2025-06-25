import { useState, useEffect } from "react";
import Input from "./common/Input/Input";
import Button from "./common/Button/Button";
import { TRANSACTION_CATEGORIES } from "../utils/constants"; // <-- IMPORT
import styles from "./TransactionForm.module.css";

const TransactionForm = ({ onSubmit, initialData = null, loading }) => {
  const [transaction, setTransaction] = useState({
    title: "",
    amount: "",
    category: TRANSACTION_CATEGORIES[0], // <-- Use constant
    type: "expense",
  });

  useEffect(() => {
    if (initialData) {
      setTransaction({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        type: initialData.type,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...transaction,
      amount: parseFloat(transaction.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="title"
        name="title"
        label="Title"
        value={transaction.title}
        onChange={handleChange}
        required
      />
      <Input
        id="amount"
        name="amount"
        label="Amount"
        type="number"
        step="0.01"
        value={transaction.amount}
        onChange={handleChange}
        required
      />
      <div className={styles.formGroup}>
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={transaction.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={transaction.category}
          onChange={handleChange}
        >
          {TRANSACTION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading} fullWidth>
        {initialData ? "Update" : "Create"} Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
