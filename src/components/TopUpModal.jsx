import { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import * as userService from "../api/userService";
import Modal from "./common/Modal/Modal";
import Input from "./common/Input/Input";
import Button from "./common/Button/Button";
import styles from "./TopUpModal.module.css";
import { formatCurrency } from "../utils/formatters";

const TopUpModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const { addToast } = useToast();
  const { loading, request: requestTopUp } = useApi(userService.topUp);

  // Kosongkan form setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setAmount("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      addToast("Please enter a valid amount.", "error");
      return;
    }

    const result = await requestTopUp(numericAmount);

    if (result.success) {
      addToast(
        `Successfully topped up ${formatCurrency(numericAmount)}!`,
        "success"
      );
      onSuccess(); // Beritahu parent component untuk refresh data
      onClose(); // Tutup modal
    } else {
      addToast(result.error || "Top up failed.", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Balance">
      <form onSubmit={handleSubmit}>
        <Input
          id="amount"
          name="amount"
          type="number"
          label="Top Up Amount (IDR)"
          placeholder="e.g., 50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div className={styles.buttonContainer}>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Processing..." : "Confirm Top Up"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TopUpModal;
