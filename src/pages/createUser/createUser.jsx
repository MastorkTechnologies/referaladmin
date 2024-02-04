import { useState } from "react";
import styles from "./createUser.module.css";
import { useSelector } from "react-redux";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const CreateUser = () => {
  const [custId, setCustId] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const user = useSelector((state) => state.auth.user);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    console.log(name, phoneNumber, email, age, gender, address);
    if (!name || !phoneNumber || !email || !age || !gender || !address) {
      toast.error("All fields are required");
      return;
    }

    if (!/^\d+$/.test(age) || parseInt(age, 10) <= 0) {
      toast.error("Age must be a positive integer");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      if (phoneNumber.length < 10) {
        toast.error("Invalid phone number");
        return;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      const docRef = doc(db, "meta", "phoneNumbers");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data()?.phoneNumbers?.includes(phoneNumber)) {
          toast.error("This phone number already exists!");
          return;
        } else {
          await updateDoc(docRef, { phoneNumbers: arrayUnion(phoneNumber) });
        }
      }

      const newUser = {
        custId,
        name,
        email,
        phoneNumber,
        age,
        gender,
        address,
        createdBy: { email: user },
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", custId), newUser);
      toast.success("user created!");

      setCustId("");
      setName("");
      setEmail("");
      setPhoneNumber("");
      setAge("");
      setGender("");
      setAddress("");
      setPhoneNumber("");
    } catch (error) {
      toast.error("Couldn't create user!");
      console.error("Error adding user:", error);
    }

    console.log("Creating user...");
    console.log("Name:", name);
    console.log("Phone Number:", phoneNumber);
    console.log("Email:", email);
    console.log("Age:", age);
    console.log("Gender:", gender);
    console.log("Address:", address);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Create User</h2>
        <div>
          <label>Customer ID:</label>
          <input
            className={styles["input"]}
            type="text"
            value={custId}
            onChange={(e) => setCustId(e.target.value)}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            className={styles["input"]}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            className={styles["input"]}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            className={styles["input"]}
            type="text"
            value={age}
            onChange={(e) => {
              console.log(e.target.value);
              setAge(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            className={styles["select"]}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Address:</label>
          <textarea
            className={styles["textarea"]}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className={styles["button"]} onClick={handleCreateUser}>
          Create User
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CreateUser;
