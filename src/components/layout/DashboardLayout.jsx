// src/components/layout/DashboardLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./DashboardLayout.module.css";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Wallet Sample</div>
        <nav className={styles.nav}>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Welcome, {user?.fullName || user?.username}!</h2>
        </header>
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
