import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import * as userService from "../api/userService";

// Component Imports
import Input from "../components/common/Input/Input";
import Button from "../components/common/Button/Button";
import Modal from "../components/common/Modal/Modal";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  // Gunakan updateUser dari context untuk sinkronisasi dengan localStorage
  const { user, logout, updateUser } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // API Hooks
  const { loading: profileLoading, request: updateProfileRequest } = useApi(
    userService.updateProfile
  );
  const { loading: passwordLoading, request: updatePasswordRequest } = useApi(
    userService.changePassword
  );
  const { loading: deleteLoading, request: deleteUserAccountRequest } = useApi(
    userService.deleteAccount
  );

  // Inisialisasi form dengan data pengguna saat komponen dimuat
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfileRequest(profileData);
    if (result.success) {
      // Panggil updateUser dari context untuk memperbarui state dan localStorage
      updateUser(result.data);
      addToast("Profile updated successfully!", "success");
    } else {
      addToast(result.error || "Failed to update profile.", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      addToast("New password must be at least 8 characters.", "error");
      return;
    }
    const result = await updatePasswordRequest(passwordData);
    if (result.success) {
      addToast("Password changed successfully!", "success");
      setPasswordData({ currentPassword: "", newPassword: "" }); // Kosongkan field
    } else {
      addToast(result.error || "Failed to change password.", "error");
    }
  };

  // Logika Hapus Akun
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletePassword("");
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const result = await deleteUserAccountRequest({ password: deletePassword });
    if (result.success) {
      addToast(
        "Account deleted successfully. You will be logged out.",
        "success"
      );
      setTimeout(() => {
        logout(); // Logout dan redirect
      }, 2000);
    } else {
      addToast(result.error || "Failed to delete account.", "error");
      handleCloseDeleteModal();
    }
  };

  return (
    <div className={styles.container}>
      <h1>Manage Your Profile</h1>
      <div className={styles.profileGrid}>
        <div className={styles.card}>
          <h2>Update Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              value={profileData.fullName}
              onChange={handleProfileChange}
            />
            <Input
              id="username"
              name="username"
              label="Username"
              value={profileData.username}
              onChange={handleProfileChange}
            />
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        <div className={styles.card}>
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <Input
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <Input
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>

      <div className={`${styles.card} ${styles.dangerZone}`}>
        <h2>Danger Zone</h2>
        <div className={styles.dangerContent}>
          <p>
            Deleting your account is a permanent action and cannot be undone.
            All your data, including your transaction history, will be removed.
          </p>
          <Button
            variant="danger"
            onClick={handleOpenDeleteModal}
            disabled={deleteLoading}
          >
            Delete My Account
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirm Account Deletion"
      >
        <form onSubmit={handleDeleteAccount}>
          <p>
            This action is irreversible. To confirm, please enter your current
            password.
          </p>
          <Input
            id="deletePassword"
            name="deletePassword"
            label="Your Password"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="danger"
            fullWidth
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete Account Permanently"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
