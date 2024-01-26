import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import styles from "./manageUser.module.css";
import { db } from "../../firebase";
import Modal from "../../components/modal/modal";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import UserDetail from "../../components/userDetail/userDetail";
import { CSVLink } from "react-csv";
import toast from "react-hot-toast";

const ManageUser = () => {
  const date = new Date();
  const currentDate = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const currentHours = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentSeconds = date.getSeconds();

  const fileName =
    "Date " +
    currentDate +
    "/" +
    currentMonth +
    "/" +
    currentYear +
    " Time " +
    currentHours +
    ":" +
    currentMinutes +
    ":" +
    currentSeconds;

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [lastDownload, setLastDownload] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isViewReferModal, setViewReferModal] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState();

  let referToData = [];
  let referralLinkData = [];
  let referedUsers = users
    .filter((user) => user.createdBy?.email === "landingpage")
    .filter((user) => user.createdAt?.toDate() >= lastDownload);

  let NoOfReferTo = referedUsers?.map((user) =>
    user?.referTo?.length === undefined ? 0 : user.referTo?.length
  );

  let NoOfReferralLink = referedUsers?.map((user) =>
    user?.referralLink?.length === undefined ? 0 : user.referralLink?.length
  );

  const getColumns = () => {
    for (let i = 0; i < Math.max(...NoOfReferTo); i++) {
      referToData.push({
        label: `Refer To Customer ${i + 1} ID`,
        key: `referTo[${i}].id`,
      });
      referToData.push({
        label: `Refer To Customer ${i + 1} Name`,
        key: `referTo[${i}].name`,
      });
      referToData.push({
        label: `Refer To Customer ${i + 1} Company`,
        key: `referTo[${i}].company`,
      });
      referToData.push({
        label: `Refer To Customer ${i + 1} Link`,
        key: `referTo[${i}].link`,
      });
    }
    for (let i = 0; i < Math.max(...NoOfReferralLink); i++) {
      referralLinkData.push({
        label: `Referral Link ${i + 1} Company`,
        key: `referralLink[${i}].company`,
      });
      referralLinkData.push({
        label: `Referral ${i + 1} Link`,
        key: `referralLink[${i}].link`,
      });
    }
  };

  getColumns();

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Address", key: "address" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "age" },
    { label: "Refer By ID", key: "referBy.id" },
    { label: "Refer By Company", key: "referBy.company" },
    { label: "Refer By Name", key: "referBy.name" },
    { label: "Refer By Domain", key: "referBy.domain" },
    ...referToData,
    ...referralLinkData,
    { label: "Created By Email", key: "createdBy.email" },
  ];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const userData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const fetchLastDownload = async () => {
      const docRef = doc(db, "meta", "lastdownloadcsv");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLastDownload(docSnap.data()?.lastDownload?.toDate());
      } else {
        console.error("Some error ocurred");
      }
    };

    fetchLastDownload();
  }, []);

  console.log(lastDownload);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };
  const handleViewReferTo = (user) => {
    setSelectedUser(user);
    setViewReferModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await deleteDoc(userDoc);

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userDoc = doc(db, "users", editedUser.id);
      await updateDoc(userDoc, editedUser);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editedUser.id ? { ...user, ...editedUser } : user
        )
      );

      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCreateReferral = (user) => {
    navigate(`/create-referral/${user.id}`);
  };

  const location = useLocation();

  return (
    <>
      <Header />
      <div className={styles["test"]}>
        <CSVLink
          className={styles.button}
          data={referedUsers}
          headers={headers}
          onClick={(event, done) => {
            const userDoc = doc(db, "meta", "lastdownloadcsv");
            updateDoc(userDoc, { lastDownload: new Date() }).then(() => {
              toast.success("Downloaded");
              done();
            });
          }}
          filename={`ReferredUsers-(${fileName}).csv`}
        >
          Download Referred Users
        </CSVLink>
        {location.pathname !== "/manage-created-users" ? (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>
                  <h2>Referred Users</h2>
                </th>
              </tr>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(
                (user) =>
                  user.createdBy.email === "landingpage" && (
                    <tr key={user.id}>
                      <td>{user?.name || "NA"}</td>
                      <td>{user?.email || "NA"}</td>
                      <td>{user?.phoneNumber || user?.phone}</td>
                      <td>{user?.age || "NA"}</td>
                      <td>{user?.gender || "NA"}</td>
                      <td>{user?.address || "NA"}</td>
                      <td>
                        <button
                          className={styles["button"]}
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleCreateReferral(user)}
                        >
                          Create Referral
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <th>
                <h2>Created Users</h2>
              </th>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(
                (user) =>
                  user?.createdBy?.email !== "landingpage" && (
                    <tr key={user?.id}>
                      <td>{user?.name || "NA"}</td>
                      <td>{user?.email || "NA"}</td>
                      <td>{user?.phoneNumber || user?.phone || "NA"}</td>
                      <td>{user?.age || "NA"}</td>
                      <td>{user?.gender || "NA"}</td>
                      <td>{user?.address || "NA"}</td>
                      <td>
                        <button
                          className={styles["button"]}
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleViewReferTo(user)}
                        >
                          View Refer To
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleCreateReferral(user)}
                        >
                          Create Referral
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles["button"]}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
        {isViewModalOpen && (
          <Modal
            isOpen={isViewModalOpen}
            onClose={() => setViewModalOpen(false)}
            title="View User"
          >
            {selectedUser && (
              <div className={styles["userDetails"]}>
                <UserDetail obj={selectedUser} />
              </div>
            )}
          </Modal>
        )}
        {isViewReferModal && (
          <Modal
            isOpen={isViewReferModal}
            onClose={() => setViewReferModal(false)}
            title="View Refer To User"
          >
            {selectedUser && (
              <div className={styles["userDetails"]}>
                {selectedUser.referTo && (
                  <UserDetail obj={selectedUser?.referTo} />
                )}
              </div>
            )}
          </Modal>
        )}
        {isEditModalOpen && (
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            title="Edit User"
          >
            <form>
              {Object.entries(editedUser)
                .filter(([key]) => key !== "createdAt")
                .filter(([key]) => key !== "createdBy")
                .filter(([key]) => key !== "id")
                .filter(([key]) => key !== "referralLink")
                .filter(([key]) => key !== "referBy")
                .filter(([key]) => key !== "referTo")
                .filter(([key]) => key !== "custId")
                .filter(([key]) => key !== "email")
                .map(([fieldName]) => (
                  <div key={fieldName}>
                    <label>
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:
                    </label>
                    <input
                      type="text"
                      value={editedUser[fieldName]}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          [fieldName]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}

              <button
                className={styles["button"]}
                type="submit"
                onClick={handleUpdateUser}
              >
                Save Changes
              </button>
            </form>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ManageUser;
