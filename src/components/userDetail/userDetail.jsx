import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./userDetail.module.css";
import toast from "react-hot-toast";
import { AiOutlineCopy } from "react-icons/ai";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const isAllValuesNonEmpty = (obj) => {
  return Object.values(obj).every(
    (value) => value !== null && value !== undefined && value !== ""
  );
};

const UserDetail = ({ obj }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = () => {
    const linkValue = obj.link;
    navigator.clipboard.writeText(linkValue);
    setCopySuccess(true);
    toast.success("link copied!");

    setTimeout(() => {
      setCopySuccess(false);
    }, 1500);
  };

  return (
    <ul className={styles["objectList"]}>
      {Array.isArray(obj)
        ? obj.map((item, index) => <UserDetail key={index} obj={item} />)
        : Object.entries(obj)
            .filter(([key]) => key !== "createdAt")
            .map(([key, value], index) => (
              <React.Fragment key={index}>
                {isAllValuesNonEmpty(value) && (
                  <li className={styles["listItem"]}>
                    <b className={styles["key"]}>
                      {capitalizeFirstLetter(key)}
                    </b>{" "}
                    {key === "link" ? (
                      <div className={styles["linkContainer"]}>
                        <span>{value}</span>
                        <button
                          disabled={copySuccess}
                          onClick={handleCopyClick}
                        >
                          <AiOutlineCopy />
                        </button>
                      </div>
                    ) : typeof value === "object" ? (
                      <UserDetail obj={value} />
                    ) : (
                      value
                    )}
                  </li>
                )}
              </React.Fragment>
            ))}
    </ul>
  );
};

UserDetail.propTypes = {
  obj: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired,
  ]),
};

export default UserDetail;
