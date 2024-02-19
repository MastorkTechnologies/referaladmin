import { useEffect, useState } from "react";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import styles from "./CMS.module.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import toast from "react-hot-toast";

const CMS = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    img_src: "",
    whatsAppNumber: "",
    section1: {
      heading: "",
      content: "",
    },
    section2: {
      heading: "",
      content: "",
    },
    section3: {
      heading: "",
      content: "",
    },
    section4: {
      heading: "",
      content: "",
    },
  });

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const metaDocRef = doc(db, "meta", "landingpage");
        const metaDocSnapshot = await getDoc(metaDocRef);

        if (metaDocSnapshot.exists()) {
          const metaData = metaDocSnapshot.data();
          setFormData(metaData);
          setCountryCode(metaData.whatsAppNumber.substring(0, 3));
          setPhoneNumber(
            metaData.whatsAppNumber.substring(3, metaData.whatsAppNumber.length)
          );
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
      }
    };

    fetchMetaData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.substring(0, name.length - 1);
    const fieldNumber = name[name.length - 1];
    const sectionName = "section" + fieldNumber;
    var otherField = "heading";
    if (fieldName === "heading") {
      otherField = "content";
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [sectionName]: {
        [fieldName]: value,
        [otherField]: prevFormData[sectionName][otherField],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.whatsAppNumber = "+" + countryCode + phoneNumber;

    try {
      const metaDocRef = doc(db, "meta", "landingpage");
      await setDoc(metaDocRef, formData);
      toast.success("Meta data updated successfully!");

      console.log("Meta data updated successfully!");
    } catch (error) {
      toast.error("Error updating meta data");
      console.error("Error updating meta data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleImageUpload = async () => {
    if (!image) return;

    try {
      setLoading(true);
      toast("Uploading image please wait!", {
        icon: "⌛",
      });

      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);

      const imageURL = await getDownloadURL(storageRef);
      setImageURL(imageURL);
      setFormData((prevFormData) => ({
        ...prevFormData,
        img_src: imageURL,
      }));

      setLoading(false);
      toast.success("Image uploaded Successfully");
    } catch (error) {
      toast.error("Error uploading image");
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Content Management System</h2>
        <div className={styles.imageUploadContainer}>
          <label htmlFor="imageInput" className={styles.imageUploadLabel}>
            Select Image
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button
          className={styles["uploadButton"]}
          onClick={handleImageUpload}
          disabled={loading}
        >
          Upload Image
        </button>

        {loading && <div className={styles.loader}>Uploading...</div>}
        {imageURL && (
          <div className={styles.uploadSuccess}>
            Image uploaded successfully!
          </div>
        )}

        <div className={styles["whatsappnumber"]}>
          <div>
            <b>Phone Number:</b>
          </div>
          <input
            className={styles["countrycode"]}
            placeholder="Country Code"
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
          <input
            className={styles["phonenumber"]}
            placeholder="Phone Number"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* <label>WhatsApp Number (with country code):</label>
        <input
          type="text"
          name="whatsAppNumber"
          value={formData.whatsAppNumber}
          placeholder="E.g. +919999955555"
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              whatsAppNumber: e.target.value,
            }))
          }
        /> */}

        <label>Heading 1:</label>
        <input
          type="text"
          name="heading1"
          value={formData.section1.heading}
          onChange={handleChange}
        />

        <label>Content 1:</label>
        <textarea
          name="content1"
          value={formData.section1.content}
          onChange={handleChange}
        ></textarea>

        <label>Heading 2:</label>
        <input
          type="text"
          name="heading2"
          value={formData.section2.heading}
          // onChange={(e) => {
          //   setFormData((prevFormData) => ({
          //     ...prevFormData,
          //     [e.target.name]: e.target.value,
          //   }));
          // }}
          onChange={handleChange}
        />

        <label>Content 2:</label>
        <textarea
          name="content2"
          value={formData.section2.content}
          onChange={handleChange}
        ></textarea>

        <label>Heading 3:</label>
        <input
          type="text"
          name="heading3"
          value={formData.section3.heading}
          onChange={handleChange}
        />

        <label>Content 3:</label>
        <textarea
          name="content3"
          value={formData.section3.content}
          onChange={handleChange}
        ></textarea>

        <label>Heading 4:</label>
        <input
          type="text"
          name="heading4"
          value={formData.section4.heading}
          onChange={handleChange}
        />

        <label>Content 4:</label>
        <textarea
          name="content4"
          value={formData.section4.content}
          onChange={handleChange}
        ></textarea>

        <button
          className={styles["button"]}
          type="submit"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CMS;
