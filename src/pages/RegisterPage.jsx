import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import * as authService from "../api/authService";
import Input from "../components/common/Input/Input";
import Button from "../components/common/Button/Button";
import styles from "./AuthPages.module.css"; // Menggunakan style yang sama dengan Login

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sisi klien dasar untuk memberikan feedback cepat
    if (formData.password.length < 8) {
      addToast("Password must be at least 8 characters long.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);

      if (response.success) {
        addToast("Registration successful! Please log in.", "success");
        navigate("/login");
      } else {
        // Jika registrasi gagal, tampilkan pesan error yang spesifik dari backend
        if (response.errors && response.errors.length > 0) {
          // Ambil pesan error pertama dari array `errors`
          const firstError = response.errors[0];
          // Format pesan agar lebih mudah dibaca, contoh: "password: Password must contain..."
          addToast(`${firstError.field}: ${firstError.message}`, "error");
        } else {
          // Fallback jika tidak ada array `errors`
          addToast(
            response.message || "Registration failed. Please check your data.",
            "error"
          );
        }
      }
    } catch (error) {
      // Menangani error jaringan atau error 500 dari server
      // `error.response.data` adalah tempat Axios menyimpan body dari respons error
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Enigwallet</h1>
        <h2 className={styles.subtitle}>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <Input
            id="username"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <Input
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="name"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            aria-describedby="password-help"
          />
          <small id="password-help" className={styles.helpText}>
            Must be at least 8 characters, with uppercase, lowercase, and a
            number.
          </small>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
        <p className={styles.redirectText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
