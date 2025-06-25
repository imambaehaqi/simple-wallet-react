import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  size = "medium",
}) => {
  const variantClass = styles[variant] || styles.primary;
  const fullWidthClass = fullWidth ? styles.fullWidth : "";
  const sizeClass = styles[size] || styles.medium;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${variantClass} ${fullWidthClass} ${sizeClass}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
