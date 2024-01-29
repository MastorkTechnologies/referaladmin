import { useState, useEffect } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./createReferral.module.css";
import { db } from "../../firebase";
import Modal from "../../components/modal/modal";
import toast from "react-hot-toast";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import UserDetail from "../../components/userDetail/userDetail";

const CreateReferral = () => {
  const domain = `https://lrd.midsongroup.com`;
  const { userId } = useParams();
  const [link, setLink] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const handleCreateReferral = async () => {
    var newReferralLink;
    var referralLink;
    if (selectedCompany == "") {
      newReferralLink = `${domain}/${userId}`;
      referralLink = {
        link: newReferralLink,
        company: null,
      };
    } else {
      newReferralLink = `${domain}/${userId}/${selectedCompany}`;
      referralLink = {
        link: newReferralLink,
        company: selectedCompany,
      };
    }

    setLink(newReferralLink);

    var temp;
    if (userDetails && userDetails.referralLink) {
      temp = [...userDetails.referralLink, referralLink];
    } else {
      temp = [referralLink];
    }

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { referralLink: temp });
    setViewModalOpen(true);
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          delete userData.referralLink;
          delete userData.referTo;
          delete userData.referBy;
          console.log(userData);
          setUserDetails(userData);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      toast.error("Copy to clipboard failed.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.createReferral}>
        <h2 style={{ marginBottom: "1rem" }}>Create Referral</h2>
        {userDetails && <UserDetail obj={userDetails} />}

        <div className={styles.container}>
          <h3>Select Company:</h3>
          <select
            className={styles.companySelect}
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option>Select</option>
            <option>Midson</option>
          </select>
          <button
            className={styles.createReferralButton}
            onClick={handleCreateReferral}
          >
            Create Referral
          </button>
        </div>
        {isViewModalOpen && (
          <Modal
            isOpen={isViewModalOpen}
            onClose={() => setViewModalOpen(false)}
            title="Referral Link"
          >
            <h3>Your Referral Link </h3>
            <div className={styles["copyLink"]}>
              <div className={styles["referralLink"]}>
                {link !== "" && <p>{link}</p>}
              </div>
              <button
                className={styles["button"]}
                onClick={() => {
                  handleCopyClick(link);
                }}
              >
                <AiOutlineCopy />
              </button>
            </div>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CreateReferral;
