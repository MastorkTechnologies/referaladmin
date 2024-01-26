import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Modal from "react-modal";
import styles from "./editPage.module.css";
import { db } from "../../firebase";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

Modal.setAppElement("#root");

const EditPage = () => {
  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("");
  const [newInputType, setNewInputType] = useState("");
  const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "meta", "landingpage");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFields(docSnap.data().fields || []);
      }
    };

    fetchData();
  }, []);

  const addField = () => {
    if (newFieldName && newFieldType && newInputType) {
      //   setFields([
      //     ...fields,
      //     {
      //       fieldName: newFieldName,
      //       fieldType: newFieldType,
      //       inputType: newInputType,
      //       options: newInputType === "dropdown" ? [] : null,
      //     },
      //   ]);
      //   setNewFieldName("");
      //   setNewFieldType("");
      //   setNewInputType("");
      const newField = {
        fieldName: newFieldName,
        fieldType: newFieldType,
        inputType: newInputType,
      };

      if (newInputType === "dropdown") {
        newField.options = [];
      }

      setFields([...fields, newField]);
      setNewFieldName("");
      setNewFieldType("");
      setNewInputType("");
    }
  };

  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const openOptionsModal = (field) => {
    setSelectedField(field);
    setOptions(field.options || []);
    setOptionsModalIsOpen(true);
  };

  const closeOptionsModal = () => {
    setOptionsModalIsOpen(false);
  };

  const addOption = () => {
    setOptions([...options, newOption]);
    setNewOption("");
  };

  const editOption = (index, newValue) => {
    const updatedOptions = [...options];
    updatedOptions[index] = newValue;
    setOptions(updatedOptions);
  };

  const deleteOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const saveOptions = () => {
    const updatedFields = fields.map((field) => {
      if (field === selectedField) {
        return { ...field, options };
      }
      return field;
    });

    setFields(updatedFields);
    setOptionsModalIsOpen(false);
  };

  const saveChanges = async () => {
    const docRef = doc(db, "meta", "landingpage");

    try {
      console.log(fields);
      await setDoc(docRef, { fields }, { merge: true });
      toast.success("Changes saved!");
    } catch (error) {
      toast.error("Some error occurred!");
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles["editPage"]}>
        <h2>Edit Page</h2>
        <div className={styles["field"]}>
          <div className={styles["fieldDetails"]}>
            <b>Name</b>and
            <b>Phone Number</b>
            <span> are mandatory fields.</span>
          </div>
        </div>
        {fields.map((field, index) => (
          <div key={index} className={styles["field"]}>
            <div className={styles["fieldDetails"]}>
              <b>Field Name: </b> {field.fieldName}
              <b>Field Type: </b> {field.fieldType}
              <b>Input Type: </b> {field.inputType}
            </div>
            <div className={styles["fieldButtons"]}>
              {field.inputType === "dropdown" && (
                <button
                  className={styles["button"]}
                  onClick={() => openOptionsModal(field)}
                >
                  {field.options ? "Edit Options" : "Add Options"}
                </button>
              )}
              <button
                className={styles["button"]}
                onClick={() => removeField(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className={styles.addFieldForm}>
          <label>
            Field Name:
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
          </label>
          <label>
            Field Type:
            <select
              className={styles["select"]}
              type="text"
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="string">String</option>
              <option value="number">Number</option>
            </select>
          </label>
          <label>
            Input Type:
            <select
              className={styles["select"]}
              type="text"
              value={newInputType}
              onChange={(e) => setNewInputType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="input">Input</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </label>
          <button
            style={{ "margin-bottom": "10px" }}
            className={styles["button"]}
            onClick={addField}
          >
            Add Field
          </button>
        </div>

        <Modal
          isOpen={optionsModalIsOpen}
          onRequestClose={closeOptionsModal}
          contentLabel="Select Options"
          style={customStyles}
        >
          <h2>Edit Options</h2>
          <div>
            {options.map((option, index) => (
              <div className={styles["option"]} key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => editOption(index, e.target.value)}
                />
                <button
                  className={styles["button"]}
                  onClick={() => deleteOption(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <button className={styles["button"]} onClick={addOption}>
              Add Option
            </button>
          </div>
          <button className={styles["button"]} onClick={saveOptions}>
            Save Options
          </button>
          <button className={styles["button"]} onClick={closeOptionsModal}>
            Cancel
          </button>
        </Modal>
        <button className={styles["button"]} onClick={saveChanges}>
          Save Changes
        </button>
        <Link to="/preview-form">
          <button
            style={{ "margin-left": "10px" }}
            className={styles["button"]}
          >
            Preview Form
          </button>
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default EditPage;
