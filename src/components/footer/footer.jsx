import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles["footer"]}>
      <div>
        <h1> Midson</h1>
      </div>
      <div className={styles["info"]}>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms and Conditions</a>
        <a href="#">License</a>
        <a href="#">Copyright</a>
      </div>
    </footer>
  );
};

export default Footer;
