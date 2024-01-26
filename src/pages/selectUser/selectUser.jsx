import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import styles from "./selectUser.module.css";
import { db } from "../../firebase";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const SelectUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersQuery = query(usersCollection);

      try {
        const snapshot = await getDocs(usersQuery);
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.phone &&
        user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles["main"]}>
      <Header />
      <div className={styles.selectUser}>
        <h2>Select User</h2>
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <Link to={`/create-referral/${user.id}`}>
                <button className={styles["button"]}>Select</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default SelectUser;
