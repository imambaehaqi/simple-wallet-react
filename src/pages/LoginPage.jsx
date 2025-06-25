import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom"; // <-- Import useSearchParams
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import Input from "../components/common/Input/Input";
import Button from "../components/common/Button/Button";
import styles from "./AuthPages.module.css"; // Kita bisa gunakan style yang sama untuk Login & Register

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Gunakan hook untuk membaca query params dari URL
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Tampilkan pesan jika redirect dari proses refresh token yang gagal
    const reason = searchParams.get("reason");
    if (reason === "session-expired") {
      addToast("Your session has expired. Please log in again.", "info");
    }
    if (isAuthenticated) {
      // Redirect jika sudah login
      window.location.href = "/";
    }
  }, [searchParams, addToast, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      if (!response.success) {
        addToast(response.message || "Invalid email or password.", "error");
      }
      // Redirect on success is handled inside a `login` function in AuthContext
    } catch (error) {
      addToast("An error occurred during login.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Enigwallet</h1>
        <h2 className={styles.subtitle}>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className={styles.redirectText}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
