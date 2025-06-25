import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../api/authService";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ambil state awal dari localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER))
  );
  const [token, setToken] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
  );
  const navigate = useNavigate();

  // Fungsi untuk mengatur state dan localStorage secara bersamaan
  const setAuthState = (userData, userToken) => {
    if (userData && userToken) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, userToken);
      setUser(userData);
      setToken(userToken);
    } else {
      // Jika dipanggil tanpa argumen, hapus state
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      setUser(null);
      setToken(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response?.data?.success) {
        const { user: userData, token: userToken } = response.data.data;
        setAuthState(userData, userToken); // Gunakan fungsi helper kita
        navigate("/");
        return { success: true };
      } else {
        return {
          success: false,
          message: response?.data?.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Network error",
      };
    }
  };

  const logout = () => {
    setAuthState(null, null); // Hapus state dan localStorage
    navigate("/login");
  };

  // Kita juga bisa memperbarui fungsi setUser untuk menyinkronkan localStorage
  // jika ada perubahan profil di ProfilePage
  const updateUser = (updatedUserData) => {
    const currentUser = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
    );
    const newUser = { ...currentUser, ...updatedUserData };
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(newUser));
    setUser(newUser);
  };

  // Nilai yang disediakan oleh context
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser, // <-- Sediakan fungsi baru ini
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
