import { Link, useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import Logout from "../../components/logout/logout";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    console.log("Creating user...");
    navigate("/create-user");
  };

  const handleManageCreatedUser = () => {
    navigate("/manage-created-users");
  };
  const handleManageReferredUser = () => {
    navigate("/manage-referred-users");
  };

  const handleCreateReferralLink = () => {
    navigate("/select-user");
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Dashboard</h2>
        <div className={styles.buttonContainer}>
          <button className={styles["button"]} onClick={handleCreateUser}>
            Create User
          </button>
          <button
            className={styles["button"]}
            onClick={handleManageReferredUser}
          >
            Manage Referred Users
          </button>
          <button
            className={styles["button"]}
            onClick={handleManageCreatedUser}
          >
            Manage Created Users
          </button>
          <button
            className={styles["button"]}
            onClick={handleCreateReferralLink}
          >
            Create Referral Link
          </button>
          <Link to="/cms">
            <button
              className={styles["button"]}
              onClick={handleCreateReferralLink}
            >
              Content Management System
            </button>
          </Link>
        </div>
        <Logout />
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
