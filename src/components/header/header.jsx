import { useSelector } from "react-redux";
import styles from "./header.module.css";
import { Link, useLocation } from "react-router-dom";
import Logout from "../logout/logout";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  return (
    <header className={styles["header"]}>
      <div>
        <h1> Midson</h1>
      </div>
      {user &&
        location.pathname !== "/dashboard" &&
        location.pathname !== "/" && (
          <div className={styles["navigation"]}>
            <Link to="/dashboard">
              <button className={styles["button"]}>Dashboard</button>
            </Link>
            <Link to="/select-user">
              <button className={styles["button"]}>Create Referral Link</button>
            </Link>
            {location.pathname === "/cms" && (
              <Link to="/edit-form">
                <button className={styles["button"]}>Edit Form</button>
              </Link>
            )}
            {location.pathname === "/edit-form" && (
              <Link to="/cms">
                <button className={styles["button"]}>
                  Content Management System
                </button>
              </Link>
            )}
            {location.pathname === "/preview-form" && (
              <Link to="/edit-form">
                <button className={styles["button"]}>Edit Form</button>
              </Link>
            )}
            <Logout />
          </div>
        )}
    </header>
  );
};

export default Header;
