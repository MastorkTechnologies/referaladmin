import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./previewForm.module.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const PreviewForm = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const docRef = doc(db, "meta", "landingpage");
        const docSnap = await getDoc(docRef);
        const firebaseFields = docSnap.data()?.fields || [];

        setFields([...existingFields, ...firebaseFields]);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    const existingFields = [
      { fieldName: "Name", fieldType: "string", inputType: "input" },
      { fieldName: "Phone Number", fieldType: "string", inputType: "input" },
    ];

    fetchFields();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.previewForm}>
        <h2 className={styles.formTitle}>Preview Form</h2>
        <form className={styles.form}>
          {fields.map((field, index) => (
            <div key={index} className={styles.formGroup}>
              <label className={styles.label}>{field.fieldName}</label>
              {field.inputType === "input" && (
                <input type="text" className={styles.input} />
              )}
              {field.inputType === "dropdown" && (
                <select className={styles.select}>
                  <option>Select</option>
                  {field.options &&
                    field.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              )}
            </div>
          ))}
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default PreviewForm;
