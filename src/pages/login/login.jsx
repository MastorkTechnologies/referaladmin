import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import styles from "./login.module.css";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { login } from "../../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(login(user.email));
        navigate("/dashboard");
        toast.success("Successfully logged in!");
        setError("");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Login</h2>
        <div>
          <label>Email:</label>
          <input
            className={styles["input"]}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className={styles["input"]}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles["button"]} onClick={handleLogin}>
          Login
        </button>
        {/* <button
          className={styles["button"]}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button> */}
      </div>
      <Footer />
    </>
  );
};

export default Login;
