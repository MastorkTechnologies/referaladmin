import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./logout.module.css";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { logout } from "../../redux/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
        toast.success("Sucessfully logged out!");
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div>
      <button className={styles["button"]} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
